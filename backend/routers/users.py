from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models

router = APIRouter(prefix="/admin/users", tags=["Users"])

# 🔌 Kết nối DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 📥 GET ALL USERS
@router.get("")
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users


# ➕ CREATE USER (FIX dấu /)
@router.post("")   # ✅ bỏ "/" để khớp frontend
def create_user(data: dict, db: Session = Depends(get_db)):
    user = models.User(
        username=data["username"],
        password=data["password"],
        email=data["email"],
        role=data["role"],
        sdt=data["sdt"],
        dia_chi=data["dia_chi"],
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "Thêm thành công"}


# ✏️ UPDATE USER (FIX data.sdt)
@router.put("/{user_id}")
def update_user(user_id: int, data: dict, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        return {"message": "Không tìm thấy"}

    user.username = data["username"]
    user.email = data["email"]           # ✅ thêm email
    user.role = data["role"]
    user.sdt = data["sdt"]               # ✅ fix
    user.dia_chi = data["dia_chi"]       # ✅ fix

    db.commit()
    return {"message": "Cập nhật thành công"}


# ❌ DELETE USER (giữ nguyên)
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        return {"message": "Không tìm thấy"}

    db.delete(user)
    db.commit()
    return {"message": "Xóa thành công"}