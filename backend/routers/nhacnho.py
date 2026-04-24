# routers/nhacnho.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, timedelta

from database import SessionLocal
from models import NhacNho
from schemas import NhacNhoCreate

router = APIRouter(prefix="/nhacnho", tags=["Nhắc nhở"])

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =============================
#  1. Tạo nhắc nhở
# =============================
@router.post("/")
def create_reminder(data: NhacNhoCreate, db: Session = Depends(get_db)):
    new_item = NhacNho(
        user_id=1,
        noi_dung=data.noi_dung,
        ngay=data.ngay,
        lap_lai=data.lap_lai
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

# =============================
#  2. Lấy tất cả
# =============================
@router.get("/")
def get_all(db: Session = Depends(get_db)):
    return db.query(NhacNho).order_by(NhacNho.ngay).all()

# =============================
#  3. Nhắc hôm nay
# =============================
@router.get("/today")
def get_today(db: Session = Depends(get_db)):
    today = date.today()
    return db.query(NhacNho).filter(NhacNho.ngay == today).all()

# =============================
#  4. Nhắc sắp tới (3 ngày)
# =============================
@router.get("/upcoming")
def upcoming(db: Session = Depends(get_db)):
    today = date.today()
    future = today + timedelta(days=3)
    return db.query(NhacNho).filter(
        NhacNho.ngay.between(today, future)
    ).all()

# =============================
#  5. Đánh dấu hoàn thành
# =============================
from models import NhacNho, GiaoDich, NganSach

@router.put("/complete/{id}")
def complete(id: int, db: Session = Depends(get_db)):
    item = db.query(NhacNho).get(id)

    if not item:
        return {"msg": "Không tìm thấy"}

    # nếu đã hoàn thành rồi thì bỏ qua
    if item.da_hoan_thanh:
        return {"msg": "Đã hoàn thành trước đó"}

    # ✅ đánh dấu hoàn thành
    item.da_hoan_thanh = True

    # 🔥 TẠO GIAO DỊCH (DÙNG LOGIC CỦA BẠN)
    gd = GiaoDich(
        user_id=item.user_id,
        loai=item.loai,
        so_tien=item.so_tien,
        danh_muc=item.danh_muc,
        mo_ta=item.noi_dung,
        ngay=item.ngay
    )

    db.add(gd)
    db.commit()
    db.refresh(gd)

    #  GỌI LẠI LOGIC NGÂN SÁCH (copy từ router giao dịch)
    if item.loai.lower() == "chi":

        danh_muc = (item.danh_muc or "Khác").strip()

        ns = db.query(NganSach).filter(
            NganSach.user_id == item.user_id,
            NganSach.danh_muc == danh_muc,
            NganSach.thang == item.ngay.strftime("%Y-%m")
        ).first()

        if ns:
            ns.da_dung += float(item.so_tien)
        else:
            ns = NganSach(
                user_id=item.user_id,
                danh_muc=danh_muc,
                gioi_han=0,
                da_dung=float(item.so_tien),
                thang=item.ngay.strftime("%Y-%m")
            )
            db.add(ns)

        db.commit()

    return {
        "msg": "Hoàn thành + tạo giao dịch",
        "giao_dich_id": gd.id
    }

# =============================
#  6. Xử lý lặp hàng tháng
# =============================
@router.put("/repeat-update")
def update_repeat(db: Session = Depends(get_db)):
    today = date.today()
    items = db.query(NhacNho).filter(
        NhacNho.lap_lai == True,
        NhacNho.ngay < today
    ).all()

    for item in items:
        item.ngay = item.ngay + timedelta(days=30)

    db.commit()
    return {"msg": "Updated repeat reminders"}

# =============================
#  7. Xóa
# =============================
@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    item = db.query(NhacNho).get(id)
    db.delete(item)
    db.commit()
    return {"msg": "Đã xóa"}