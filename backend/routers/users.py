from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models

router = APIRouter(prefix="/admin/users", tags=["Users"])

# Kết nối DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# GET ALL USERS
@router.get("")
def get_users(role: str, db: Session = Depends(get_db)):
    if role != "admin":
        return {"message": "❌ Không có quyền"}
    return db.query(models.User).all()


@router.post("")
def create_user(data: dict, role: str, db: Session = Depends(get_db)):
    if role != "admin":
        return {"message": "❌ Không có quyền"}

    user = models.User(**data)
    db.add(user)
    db.commit()
    return {"message": "Thêm thành công"}


@router.put("/{user_id}")
def update_user(user_id: int, data: dict, role: str, db: Session = Depends(get_db)):
    if role != "admin":
        return {"message": "❌ Không có quyền"}

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return {"message": "Không tìm thấy"}

    for key, value in data.items():
        setattr(user, key, value)

    db.commit()
    return {"message": "Cập nhật thành công"}


@router.delete("/{user_id}")
def delete_user(user_id: int, role: str, db: Session = Depends(get_db)):
    if role != "admin":
        return {"message": "❌ Không có quyền"}

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return {"message": "Không tìm thấy"}

    db.delete(user)
    db.commit()
    return {"message": "Xóa thành công"}