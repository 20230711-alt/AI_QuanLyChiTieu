from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas

router = APIRouter(prefix="/giaodich", tags=["Giao dịch"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_all(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.GiaoDich).filter(models.GiaoDich.user_id == user_id).all()

@router.post("/")
def create(data: schemas.GiaoDichCreate, db: Session = Depends(get_db)):
    # 👉 1. lưu giao dịch
    gd = models.GiaoDich(**data.dict())
    db.add(gd)
    db.commit()
    db.refresh(gd)

    # 👉 2. nếu là CHI → xử lý ngân sách
    if data.loai.lower() == "chi":

        # chuẩn hóa danh mục (tránh lệch chữ hoa/thường)
        danh_muc = data.danh_muc.strip()

        ns = db.query(models.NganSach).filter(
            models.NganSach.user_id == data.user_id,
            models.NganSach.danh_muc == danh_muc,
            models.NganSach.thang == data.ngay.strftime("%Y-%m")
        ).first()

        if ns:
            # 👉 đã có → cộng tiền
            ns.da_dung += data.so_tien
        else:
            # 👉 CHƯA CÓ → TỰ TẠO
            ns = models.NganSach(
                user_id=data.user_id,
                danh_muc=danh_muc,
                gioi_han=0,              # chưa set limit
                da_dung=data.so_tien,   # tiền vừa chi
                thang=data.ngay.strftime("%Y-%m")
            )
            db.add(ns)

        db.commit()

    return gd