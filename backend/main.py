from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from database import SessionLocal, engine
from models import User, Base
from schemas import UserLogin, UserRegister
from routers import users
from routers import giaodich
from routers import ngansach
from routers import muctieu
from routers import thongke
from routers import nhacnho
app = FastAPI()

# CORS middleware must be registered BEFORE routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(users.router)
app.include_router(giaodich.router)
app.include_router(ngansach.router)
app.include_router(muctieu.router)
app.include_router(thongke.router)
app.include_router(nhacnho.router)

#  kết nối DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ======================
#  API test
# ======================
@app.get("/")
def home():
    return {"message": "API đang chạy"}


# ======================
#  ĐĂNG KÝ
# ======================
@app.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    exist = db.query(User).filter(User.email == user.email).first()
    if exist:
        return {"message": "Email đã tồn tại"}

    new_user = User(
        username=user.username,   
        email=user.email,
        password=user.password,
        sdt=user.sdt,          
        dia_chi=user.dia_chi
    )

    db.add(new_user)
    db.commit()

    return {"message": "Đăng ký thành công"}

# ======================
#  ĐĂNG NHẬP
# ======================
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()

    if db_user is None:
        return {"message": "Sai tài khoản"}

    if db_user.password != user.password:
        return {"message": "Sai mật khẩu"}

    return {"message": "Đăng nhập thành công",
            "role": db_user.role
            }
# ======================
#  ADMIN - LẤY DANH SÁCH USER
# ======================
@app.get("/admin/users")
def get_users(role: str, db: Session = Depends(get_db)):
    if role != "admin":
        return {"message": "Không có quyền"}   

    users = db.query(User).all()
    return users

if __name__ == "__main__":
    import uvicorn
    import sys
    # Force UTF-8 stdout to prevent UnicodeEncodeError on Windows (cp1252)
    if sys.stdout.encoding != "utf-8":
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)