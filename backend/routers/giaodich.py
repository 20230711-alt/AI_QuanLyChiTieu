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
@router.delete("/{id}")
def delete_gd(id: int, db: Session = Depends(get_db)):
    gd = db.query(models.GiaoDich).filter(models.GiaoDich.id == id).first()
    if not gd:
        return {"error": "Không tìm thấy"}

    db.delete(gd)
    db.commit()
    return {"message": "Đã xóa"}

@router.put("/{id}")
def update_gd(id: int, data: schemas.GiaoDichCreate, db: Session = Depends(get_db)):
    gd = db.query(models.GiaoDich).filter(models.GiaoDich.id == id).first()
    if not gd:
        return {"error": "Không tìm thấy"}

    gd.loai = data.loai
    gd.so_tien = data.so_tien
    gd.danh_muc = data.danh_muc
    gd.mo_ta = data.mo_ta
    gd.ngay = data.ngay

    db.commit()
    db.refresh(gd)
    return gd

@router.get("/")
def get_all(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.GiaoDich).filter(models.GiaoDich.user_id == user_id).all()

@router.post("/")
def create(data: schemas.GiaoDichCreate, db: Session = Depends(get_db)):
    #  1. CHUẨN HÓA DANH MỤC
    def capitalize_words(s: str):
        return " ".join(word.capitalize() for word in s.split())

    danh_muc = capitalize_words(data.danh_muc.strip())

    #  2. LƯU GIAO DỊCH
    gd = models.GiaoDich(
        user_id=data.user_id,
        loai=data.loai,
        so_tien=data.so_tien,
        danh_muc=danh_muc,   
        mo_ta=data.mo_ta,
        ngay=data.ngay
    )

    db.add(gd)
    db.commit()
    db.refresh(gd)

    #  3. XỬ LÝ NGÂN SÁCH

    if data.loai.lower() == "chi":

        thang = data.ngay.strftime("%Y-%m")

        ns = db.query(models.NganSach).filter(
            models.NganSach.user_id == data.user_id,
            models.NganSach.thang == thang,
            models.NganSach.danh_muc.ilike(danh_muc)
        ).first()

        if ns:
            ns.da_dung += data.so_tien
        else:
            ns = models.NganSach(
                user_id=data.user_id,
                danh_muc=danh_muc,
                gioi_han=0,
                da_dung=data.so_tien,
                thang=thang
            )
            db.add(ns)

        db.commit()

    return gd