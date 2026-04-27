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
def get_all(
    time: str = None,
    mode: str = "month",

    # ✅ THÊM RANGE DATE (KHÔNG PHÁ CŨ)
    from_date: str = None,
    to_date: str = None,

    db: Session = Depends(get_db)
):
    result = []

    # =========================
    # 🔥 GIỮ NGUYÊN LOGIC CŨ
    # =========================
    if time and mode == "month":
        ns_list = db.query(models.NganSach).filter(
            models.NganSach.thang == time
        ).all()

    elif time and mode == "year":
        ns_list = db.query(models.NganSach).filter(
            models.NganSach.thang.startswith(time)
        ).all()

    else:
        ns_list = db.query(models.NganSach).all()

    # =========================
    # 🔥 LOOP
    # =========================
    for ns in ns_list:

        query = db.query(func.sum(models.GiaoDich.so_tien))\
            .filter(
                models.GiaoDich.danh_muc == ns.danh_muc,
                models.GiaoDich.loai == "chi"
            )

        # =========================
        # 🔥 ƯU TIÊN RANGE DATE (NEW)
        # =========================
        if from_date and to_date:
            query = query.filter(
                models.GiaoDich.ngay >= from_date,
                models.GiaoDich.ngay <= to_date
            )

        # =========================
        # 🔥 LOGIC CŨ (GIỮ NGUYÊN)
        # =========================
        elif time:
            if mode == "day":
                query = query.filter(
                    func.date(models.GiaoDich.ngay) == time
                )

            elif mode == "month":
                query = query.filter(
                    func.date_format(models.GiaoDich.ngay, "%Y-%m") == time
                )

            elif mode == "year":
                query = query.filter(
                    func.date_format(models.GiaoDich.ngay, "%Y") == time
                )

        tong_chi = query.scalar() or 0

        result.append({
            "id": ns.id,
            "danh_muc": ns.danh_muc,
            "gioi_han": ns.gioi_han,
            "da_dung": abs(tong_chi)
        })

    return result


# POST (GIỮ NGUYÊN)
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


# PUT (GIỮ NGUYÊN)
@router.put("/{id}")
def update(id: int, data: dict, db: Session = Depends(get_db)):
    ns = db.query(models.NganSach).filter(models.NganSach.id == id).first()

    if not ns:
        return {"message": "Không tìm thấy"}

    ns.danh_muc = data["ten"]
    ns.gioi_han = data["gioiHan"]

    db.commit()
    db.refresh(ns)

    return ns