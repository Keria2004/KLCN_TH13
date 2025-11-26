from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.models import User
from app.schemas.schemas import RegisterRequest, RegisterResponse

router = APIRouter(prefix="/register", tags=["Auth"])


@router.post("/", response_model=RegisterResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):

    # Kiểm tra email đã tồn tại chưa
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Tạo user
    new_user = User(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=payload.password, 
        role=payload.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return RegisterResponse(
        id=new_user.id,
        full_name=new_user.full_name,
        email=new_user.email,
        role=new_user.role
    )
