from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models
from collections import defaultdict
from datetime import datetime
from sqlalchemy import func  # 🔥 THÊM

router = APIRouter(prefix="/thongke", tags=["Thống kê"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# 👉 THỐNG KÊ (GIỮ NGUYÊN + THÊM FILTER)
# =========================
@router.get("/")
def get_thong_ke(
    thang: str = None,
    user_id: int = 1,

    # 🔥 THÊM
    time: str = None,
    mode: str = "month",
    from_date: str = None,
    to_date: str = None,

    db: Session = Depends(get_db)
):

    # =========================
    # 👉 fallback nếu không truyền tháng
    # =========================
    if not thang:
        thang = datetime.now().strftime("%Y-%m")

    # =========================
    # 👉 lấy toàn bộ giao dịch user
    # =========================
    data = db.query(models.GiaoDich).filter(
        models.GiaoDich.user_id == user_id
    ).all()

    # =========================
    # 👉 FILTER (GIỮ NGUYÊN + THÊM)
    # =========================
    data_thang = []

    for i in data:
        if not i.ngay:
            continue

        # 🔥 RANGE DATE (ƯU TIÊN CAO NHẤT)
        if from_date and to_date:
            if str(i.ngay) >= from_date and str(i.ngay) <= to_date:
                data_thang.append(i)
            continue

        # 🔥 FILTER MỚI
        if time:
            if mode == "day":
                if str(i.ngay) == time:
                    data_thang.append(i)

            elif mode == "month":
                if i.ngay.strftime("%Y-%m") == time:
                    data_thang.append(i)

            elif mode == "year":
                if i.ngay.strftime("%Y") == time:
                    data_thang.append(i)

        else:
            # 🔥 GIỮ NGUYÊN LOGIC CŨ
            thang_gd = i.ngay.strftime("%Y-%m")
            if thang_gd == thang:
                data_thang.append(i)

    # =========================
    # 👉 TÍNH TOÁN (GIỮ NGUYÊN)
    # =========================
    tong_thu = sum(float(i.so_tien or 0) for i in data_thang if i.loai == "thu")
    tong_chi = sum(float(i.so_tien or 0) for i in data_thang if i.loai == "chi")
    so_du = tong_thu - tong_chi

    # =========================
    # 👉 CHI THEO DANH MỤC
    # =========================
    chi_theo_danh_muc = defaultdict(float)

    for i in data_thang:
        if i.loai == "chi":
            key = i.danh_muc if i.danh_muc else "Khác"
            chi_theo_danh_muc[key] += float(i.so_tien or 0)

    # =========================
    # 👉 CHI THEO NGÀY
    # =========================
    chi_theo_ngay = defaultdict(float)

    for i in data_thang:
        if i.loai == "chi":
            day = i.ngay.day
            chi_theo_ngay[day] += float(i.so_tien or 0)

    # Debug log (ASCII-safe for Windows cp1252 encoding)
    print(f"===== DEBUG THONG KE | thang={thang} | total={len(data)} | filtered={len(data_thang)} =====")

    # =========================
    # 👉 LƯU DB (GIỮ NGUYÊN)
    # =========================
    tk = db.query(models.ThongKe).filter(
        models.ThongKe.user_id == user_id,
        models.ThongKe.thang == thang
    ).first()

    if tk:
        tk.tong_thu = tong_thu
        tk.tong_chi = tong_chi
        tk.so_du = so_du
    else:
        tk = models.ThongKe(
            user_id=user_id,
            thang=thang,
            tong_thu=tong_thu,
            tong_chi=tong_chi,
            so_du=so_du
        )
        db.add(tk)

    db.commit()

    # =========================
    # 👉 RETURN (GIỮ NGUYÊN)
    # =========================
    return {
        "tong_thu": tong_thu,
        "tong_chi": tong_chi,
        "so_du": so_du,
        "chi_theo_danh_muc": dict(chi_theo_danh_muc),
        "chi_theo_ngay": dict(chi_theo_ngay)
    }