import os
from datetime import datetime, date

from google import genai
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

import models
from database import SessionLocal

load_dotenv()

# Khởi tạo Gemini client một lần khi app khởi động
_genai_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

router = APIRouter(prefix="/ai", tags=["AI"])


# ─── DB dependency ────────────────────────────────────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ─── Schemas ──────────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    user_id: int
    message: str


# ─── Helpers ──────────────────────────────────────────────────────────────────
def _get_this_month_txns(user_id: int, db: Session) -> list:
    """Lấy danh sách giao dịch trong tháng hiện tại của user."""
    current_month = datetime.now().strftime("%Y-%m")
    all_txns = db.query(models.GiaoDich).filter(models.GiaoDich.user_id == user_id).all()
    return [t for t in all_txns if str(t.ngay).startswith(current_month)]


def _collect_context(user_id: int, db: Session) -> dict:
    """Tổng hợp dữ liệu tài chính của user thành một dict để AI sử dụng."""
    current_month = datetime.now().strftime("%Y-%m")
    today = date.today()
    txns = _get_this_month_txns(user_id, db)

    # Tổng thu / chi / số dư / tỷ lệ tiết kiệm
    total_income  = sum(float(t.so_tien) for t in txns if t.loai == "thu")
    total_expense = sum(float(t.so_tien) for t in txns if t.loai == "chi")
    balance       = total_income - total_expense
    saving_rate   = round(balance / total_income * 100, 1) if total_income > 0 else 0

    # Top 5 danh mục chi nhiều nhất
    cat_totals: dict[str, float] = {}
    for t in txns:
        if t.loai == "chi":
            cat_totals[t.danh_muc or "Khác"] = cat_totals.get(t.danh_muc or "Khác", 0) + float(t.so_tien)
    top_categories = sorted(
        [{"name": k, "amount": v} for k, v in cat_totals.items()],
        key=lambda x: x["amount"], reverse=True
    )[:5]

    # Ngân sách đã dùng >= 80% → đưa vào cảnh báo
    budgets = (
        db.query(models.NganSach)
        .filter(models.NganSach.user_id == user_id, models.NganSach.thang == current_month)
        .all()
    )
    budget_alerts = [
        {
            "category": b.danh_muc,
            "used": float(b.da_dung),
            "limit": float(b.gioi_han),
            "percent": round(float(b.da_dung) / float(b.gioi_han) * 100, 1),
        }
        for b in budgets
        if b.gioi_han and float(b.gioi_han) > 0
        and float(b.da_dung) / float(b.gioi_han) * 100 >= 80
    ]

    # Mục tiêu tiết kiệm + tiến độ
    goals = db.query(models.MucTieu).filter(models.MucTieu.user_id == user_id).all()
    goal_alerts = [
        {
            "name": g.ten,
            "target": float(g.muc_tieu),
            "achieved": float(g.da_dat),
            "progress_pct": round(float(g.da_dat) / float(g.muc_tieu) * 100, 1) if g.muc_tieu else 0,
            "days_left": (g.deadline - today).days if g.deadline else None,
        }
        for g in goals
    ]

    return {
        "current_month": current_month,
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "saving_rate": saving_rate,
        "top_categories": top_categories,
        "budget_alerts": budget_alerts,
        "goal_alerts": goal_alerts,
    }


def _compute_health_score(ctx: dict) -> tuple[int, str]:
    """
    Tính điểm sức khỏe tài chính (0–100):
      +30 nếu chi < thu
      +25 nếu tỷ lệ tiết kiệm >= 20%
      +25 nếu không có ngân sách nào > 90%
      +20 nếu có ít nhất 1 mục tiêu
      -10 mỗi ngân sách vượt 100%
    """
    score = 0
    if ctx["total_income"] > 0 and ctx["balance"] >= 0:   score += 30
    if ctx["saving_rate"] >= 20:                           score += 25
    if not any(a["percent"] >= 90 for a in ctx["budget_alerts"]): score += 25
    if ctx["goal_alerts"]:                                 score += 20
    score -= sum(10 for a in ctx["budget_alerts"] if a["percent"] >= 100)
    score = max(0, min(100, score))

    label = "Tốt" if score >= 75 else "Cần cải thiện" if score >= 50 else "Cảnh báo"
    return score, label


def _generate_insights(ctx: dict) -> list[dict]:
    """Sinh danh sách nhận xét dựa trên rule — không dùng AI để đảm bảo tốc độ."""
    insights = []

    # Chi vượt thu
    if ctx["total_income"] > 0 and ctx["total_expense"] > ctx["total_income"]:
        insights.append({
            "type": "warning", "priority": "urgent",
            "title": "Chi vượt thu nhập",
            "description": f"Tháng này chi nhiều hơn thu {ctx['total_expense'] - ctx['total_income']:,.0f}đ. Cần cắt giảm ngay!",
        })

    # Cảnh báo ngân sách gần/đã cạn
    for a in ctx["budget_alerts"]:
        insights.append({
            "type": "warning",
            "priority": "urgent" if a["percent"] >= 100 else "medium",
            "title": f"Ngân sách '{a['category']}' {a['percent']}%",
            "description": f"Đã dùng {a['used']:,.0f}đ / {a['limit']:,.0f}đ giới hạn tháng này.",
        })

    # Mục tiêu sắp đến hạn mà tiến độ còn thấp
    for g in ctx["goal_alerts"]:
        if g["days_left"] is not None and g["days_left"] <= 30 and g["progress_pct"] < 80:
            insights.append({
                "type": "suggestion", "priority": "medium",
                "title": f"Mục tiêu '{g['name']}' sắp đến hạn",
                "description": f"Còn {g['days_left']} ngày, tiến độ {g['progress_pct']}%. Cần tiết kiệm thêm để kịp deadline.",
            })

    # Tỷ lệ tiết kiệm tốt
    if ctx["saving_rate"] >= 20:
        insights.append({
            "type": "praise", "priority": "low",
            "title": "Tuyệt vời! Tỷ lệ tiết kiệm tốt",
            "description": f"Bạn đang tiết kiệm {ctx['saving_rate']}% thu nhập. Tiếp tục duy trì nhé!",
        })

    # Gợi ý giảm danh mục tốn kém nhất
    if ctx["top_categories"]:
        top = ctx["top_categories"][0]
        insights.append({
            "type": "suggestion", "priority": "low",
            "title": f"Danh mục chi nhiều nhất: {top['name']}",
            "description": f"Bạn đã chi {top['amount']:,.0f}đ cho '{top['name']}' tháng này. Xem xét có thể giảm không?",
        })

    return insights


# ─── GET /ai/analyze ──────────────────────────────────────────────────────────
@router.get("/analyze")
def analyze(user_id: int, db: Session = Depends(get_db)):
    """Trả về điểm sức khỏe tài chính + danh sách insight cho user."""
    ctx = _collect_context(user_id, db)
    health_score, health_label = _compute_health_score(ctx)
    return {"health_score": health_score, "health_label": health_label, **ctx, "insights": _generate_insights(ctx)}


# ─── POST /ai/chat ────────────────────────────────────────────────────────────
@router.post("/chat")
def chat(body: ChatRequest, db: Session = Depends(get_db)):
    """Gửi câu hỏi + dữ liệu tài chính thực của user lên Gemini, trả về lời khuyên."""
    ctx = _collect_context(body.user_id, db)

    system_prompt = f"""Bạn là trợ lý tài chính AI tên "FinBot". Trả lời ngắn gọn bằng tiếng Việt.

DỮ LIỆU THÁNG {ctx['current_month']}:
- Thu: {ctx['total_income']:,.0f}đ | Chi: {ctx['total_expense']:,.0f}đ | Dư: {ctx['balance']:,.0f}đ
- Tiết kiệm: {ctx['saving_rate']}% | Cảnh báo ngân sách: {len(ctx['budget_alerts'])} | Mục tiêu: {len(ctx['goal_alerts'])}
- Top chi: {', '.join(f"{c['name']} ({c['amount']:,.0f}đ)" for c in ctx['top_categories'][:3])}

NGUYÊN TẮC: Tối đa 3-4 câu. Dùng số liệu thực. Kết thúc bằng 1 lời khuyên hành động cụ thể."""

    try:
        response = _genai_client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=f"{system_prompt}\n\nCâu hỏi: {body.message}",
        )
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")
