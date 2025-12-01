from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.models import User
from app.schemas.schemas import RegisterRequest, RegisterResponse

router = APIRouter(prefix="/register", tags=["Auth"])


@router.post("/", response_model=RegisterResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):

    # Kiểm tra username đã tồn tại chưa (nếu có)
    if payload.username:
        existing_username = db.query(User).filter(User.username == payload.username).first()
        if existing_username:
            raise HTTPException(status_code=400, detail="Username already exists")

    # Kiểm tra email đã tồn tại chưa
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Tạo user
    new_user = User(
        username=payload.username,  # Có thể None
        full_name="User",  # Default value
        email=payload.email,
        password_hash=payload.password, 
        role=payload.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return RegisterResponse(
        id=new_user.id,
        email=new_user.email,
        role=new_user.role
    )
