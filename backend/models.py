from sqlalchemy import Column, Integer, String, DECIMAL, Date, ForeignKey, Float, DateTime, Boolean
from database import Base
from datetime import datetime
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100))
    email = Column(String(100), unique=True, index=True)  
    password = Column(String(100))
    role = Column(String(20), default="user")
    sdt = Column(String)
    dia_chi = Column(String)
class GiaoDich(Base):
    __tablename__ = "giao_dich"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    loai = Column(String(10))
    so_tien = Column(DECIMAL(15, 2))
    danh_muc = Column(String(50))
    mo_ta = Column(String(255))
    ngay = Column(Date)
class NganSach(Base):
    __tablename__ = "ngan_sach"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    danh_muc = Column(String(255))
    gioi_han = Column(Float)
    thang = Column(String(10))
    da_dung = Column(Float, default=0)
class MucTieu(Base):
    __tablename__ = "muc_tieu"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    ten = Column(String(255))
    muc_tieu = Column(Float)
    da_dat = Column(Float, default=0)
    deadline = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)
class ThongKe(Base):
    __tablename__ = "thong_ke"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    thang = Column(String(7))  
    tong_thu = Column(Float, default=0)
    tong_chi = Column(Float, default=0)
    so_du = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)   
class NhacNho(Base):
    __tablename__ = "nhac_nho"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    noi_dung = Column(String(255))
    ngay = Column(Date)
    lap_lai = Column(Boolean, default=False)
    da_hoan_thanh = Column(Boolean, default=False)
    so_tien = Column(DECIMAL(15, 2), default=0)
    danh_muc = Column(String(50), default="Khác")
    loai = Column(String(10), default="chi")
    created_at = Column(DateTime, default=datetime.utcnow)