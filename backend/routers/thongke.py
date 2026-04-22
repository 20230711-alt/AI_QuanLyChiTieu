from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models
from collections import defaultdict
from datetime import datetime

router = APIRouter(prefix="/thongke", tags=["Thống kê"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# 👉 THỐNG KÊ THEO THÁNG (FIX KHÔNG ĐỤNG FILE KHÁC)
# =========================
@router.get("/")
def get_thong_ke(thang: str, user_id: int = 1, db: Session = Depends(get_db)):

    # fallback nếu không truyền tháng
    if not thang:
        thang = datetime.now().strftime("%Y-%m")

    # 👉 lấy toàn bộ giao dịch user
    data = db.query(models.GiaoDich).filter(
        models.GiaoDich.user_id == user_id
    ).all()

    # =========================
    # 👉 FILTER THEO THÁNG (KHÔNG DÙNG extract để tránh lỗi DB)
    # =========================
    data_thang = []

    for i in data:
        if not i.ngay:
            continue

        # convert về string yyyy-mm
        thang_gd = i.ngay.strftime("%Y-%m")

        if thang_gd == thang:
            data_thang.append(i)

    # =========================
    # 👉 TÍNH TOÁN
    # =========================
    tong_thu = sum(float(i.so_tien) for i in data_thang if i.loai == "thu")
    tong_chi = sum(float(i.so_tien) for i in data_thang if i.loai == "chi")
    so_du = tong_thu - tong_chi

    # =========================
    # 👉 CHI THEO DANH MỤC
    # =========================
    chi_theo_danh_muc = defaultdict(float)

    for i in data_thang:
        if i.loai == "chi":
            chi_theo_danh_muc[i.danh_muc] += float(i.so_tien)

    # =========================
    # 👉 CHI THEO NGÀY
    # =========================
    chi_theo_ngay = defaultdict(float)

    for i in data_thang:
        if i.loai == "chi":
            day = i.ngay.day
            chi_theo_ngay[day] += float(i.so_tien)

    # =========================
    # 👉 DEBUG (QUAN TRỌNG)
    # =========================
    print("===== DEBUG THONG KE =====")
    print("Tháng:", thang)
    print("Tổng record:", len(data))
    print("Sau filter:", len(data_thang))
    print("==========================")

    return {
        "tong_thu": tong_thu,
        "tong_chi": tong_chi,
        "so_du": so_du,
        "chi_theo_danh_muc": chi_theo_danh_muc,
        "chi_theo_ngay": chi_theo_ngay
    }