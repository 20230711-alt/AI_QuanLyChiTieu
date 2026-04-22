from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas
from sqlalchemy import func

router = APIRouter(prefix="/ngansach", tags=["Ngân sách"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# GET
@router.get("/")
def get_all(db: Session = Depends(get_db)):
    result = []

    ns_list = db.query(models.NganSach).all()

    for ns in ns_list:
        tong_chi = db.query(func.sum(models.GiaoDich.so_tien))\
            .filter(
                models.GiaoDich.danh_muc == ns.danh_muc,
                models.GiaoDich.loai == "chi"
            ).scalar() or 0

        result.append({
            "id": ns.id,
            "danh_muc": ns.danh_muc,
            "gioi_han": ns.gioi_han,
            "da_dung": abs(tong_chi)
        })

    return result

# POST
@router.post("/")
def create(data: schemas.NganSachCreate, db: Session = Depends(get_db)):
    ns = models.NganSach(
        user_id=1,
        danh_muc=data.ten,
        gioi_han=data.gioiHan,
        thang=data.thang
    )

    db.add(ns)
    db.commit()
    db.refresh(ns)
    return ns

#  PUT (THÊM MỚI - KHÔNG ẢNH HƯỞNG LOGIC CŨ)
@router.put("/{id}")
def update(id: int, data: dict, db: Session = Depends(get_db)):
    ns = db.query(models.NganSach).filter(models.NganSach.id == id).first()

    if not ns:
        return {"message": "Không tìm thấy"}

    # giữ đúng field theo frontend
    ns.danh_muc = data["ten"]
    ns.gioi_han = data["gioiHan"]

    db.commit()
    db.refresh(ns)

    return ns