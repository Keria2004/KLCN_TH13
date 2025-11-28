from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db

from app.models.models import User
from app.schemas.schemas import LoginRequest, LoginResponse

router = APIRouter(prefix="/login", tags=["Auth"])


@router.post("/", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Đăng nhập"""
    # Tìm người dùng theo email (hoặc username)
    user = (
        db.query(User)
        .filter(User.email == payload.username)
        .first()
    )

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # Kiểm tra mật khẩu (simple compare)
    if user.password_hash != payload.password:
        raise HTTPException(status_code=401, detail="Incorrect password")

    # Tạo token đơn giản (chưa JWT, dùng tạm)
    token = f"token_{user.id}"

    return LoginResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        token=token
    )
