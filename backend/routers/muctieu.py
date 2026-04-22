from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas
from datetime import datetime

router = APIRouter(prefix="/muctieu", tags=["Mục tiêu"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# 👉 GET ALL
# =========================
@router.get("/")
def get_all(db: Session = Depends(get_db)):
    data = db.query(models.MucTieu).all()

    return [
        {
            "id": i.id,
            "ten": i.ten,
            "muc_tieu": i.muc_tieu or 0,
            "da_dat": i.da_dat or 0,
            "deadline": str(i.deadline) if i.deadline else ""
        }
        for i in data
    ]


# =========================
# 👉 CREATE
# =========================
@router.post("/")
def create(data: schemas.MucTieuCreate, db: Session = Depends(get_db)):

    # ✅ parse deadline an toàn
    deadline = None
    if data.deadline and data.deadline != "":
        try:
            deadline = datetime.strptime(data.deadline, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Sai định dạng ngày (yyyy-mm-dd)")

    mt = models.MucTieu(
        user_id=1,
        ten=data.ten,
        muc_tieu=float(data.muc_tieu),
        da_dat=0,
        deadline=deadline
    )

    db.add(mt)
    db.commit()
    db.refresh(mt)
    return mt


# =========================
# 👉 THÊM TIỀN
# =========================
@router.put("/{id}/them-tien")
def them_tien(id: int, data: schemas.ThemTien, db: Session = Depends(get_db)):
    mt = db.query(models.MucTieu).filter(models.MucTieu.id == id).first()

    if not mt:
        raise HTTPException(status_code=404, detail="Không tìm thấy mục tiêu")

    mt.da_dat = (mt.da_dat or 0) + float(data.so_tien)

    db.commit()
    db.refresh(mt)
    return mt


# =========================
# 👉 UPDATE
# =========================
@router.put("/{id}")
def update(id: int, data: schemas.MucTieuCreate, db: Session = Depends(get_db)):
    mt = db.query(models.MucTieu).filter(models.MucTieu.id == id).first()

    if not mt:
        raise HTTPException(status_code=404, detail="Không tìm thấy")

    # ✅ parse deadline an toàn
    deadline = None
    if data.deadline and data.deadline != "":
        try:
            deadline = datetime.strptime(data.deadline, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Sai định dạng ngày")

    mt.ten = data.ten
    mt.muc_tieu = float(data.muc_tieu)
    mt.deadline = deadline

    db.commit()
    db.refresh(mt)
    return mt


# =========================
# 👉 DELETE
# =========================
@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    mt = db.query(models.MucTieu).filter(models.MucTieu.id == id).first()

    if not mt:
        raise HTTPException(status_code=404, detail="Không tìm thấy")

    db.delete(mt)
    db.commit()
    return {"message": "Đã xóa"}


# =========================
# 👉 🆕 LẤY SỐ DƯ (TỪ GIAO DỊCH)
# =========================
@router.get("/so-du")
def get_so_du(db: Session = Depends(get_db)):
    thu = db.query(models.GiaoDich).filter(models.GiaoDich.loai == "thu").all()
    chi = db.query(models.GiaoDich).filter(models.GiaoDich.loai == "chi").all()

    tong_thu = sum(i.so_tien for i in thu)
    tong_chi = sum(i.so_tien for i in chi)

    return {
        "so_du": tong_thu - tong_chi
    }