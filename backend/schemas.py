from pydantic import BaseModel
from datetime import date
from typing import Optional
class UserLogin(BaseModel):
    username: str
    password: str
    sdt: str | None = None
    dia_chi: str | None = None

class UserRegister(BaseModel):
    username: str  
    email: str
    password: str
    sdt: str | None = None
    dia_chi: str | None = None

class UserProfileUpdate(BaseModel):
    email: str | None = None
    password: str | None = None
    sdt: str | None = None
    dia_chi: str | None = None


class GiaoDichCreate(BaseModel):
    user_id: int
    loai: str
    so_tien: float
    danh_muc: str
    mo_ta: str
    ngay: date


class GiaoDichOut(GiaoDichCreate):
    id: int

    class Config:
        from_attributes = True


class NganSachCreate(BaseModel):
    ten: str
    gioiHan: float
    thang: str

#  tạo mục tiêu
class MucTieuCreate(BaseModel):
    ten: str
    muc_tieu: float
    deadline: Optional[str] = None


# thêm tiền vào mục tiêu
class ThemTien(BaseModel):
    so_tien: float


# response trả về frontend
class MucTieuOut(BaseModel):
    id: int
    ten: str
    muc_tieu: float
    da_dat: float
    deadline: date | None = None

    class Config:
        from_attributes = True
class NhacNhoCreate(BaseModel):
    noi_dung: str
    ngay: date
    lap_lai: bool = False

class NhacNhoOut(BaseModel):
    id: int
    noi_dung: str
    ngay: date
    lap_lai: bool
    da_hoan_thanh: bool

    class Config:
        from_attributes = True