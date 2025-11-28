from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db

from app.models.models import User
from app.schemas.schemas import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserResponse)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    """Tạo người dùng mới"""
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(**payload.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get("/")
def get_all_users(db: Session = Depends(get_db)):
    """Lấy danh sách tất cả người dùng"""
    users = db.query(User).all()
    
    return {
        "status": "success",
        "total": len(users),
        "data": [
            {
                "id": u.id,
                "full_name": u.full_name,
                "email": u.email,
                "role": u.role,
                "is_active": u.is_active,
                "created_at": u.created_at,
                "last_login": u.last_login
            }
            for u in users
        ]
    }


@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Lấy thông tin người dùng"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "status": "success",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at,
            "last_login": user.last_login
        }
    }


@router.put("/{user_id}")
def update_user(user_id: int, payload: dict, db: Session = Depends(get_db)):
    """Cập nhật người dùng"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if "full_name" in payload:
        user.full_name = payload["full_name"]
    if "is_active" in payload:
        user.is_active = payload["is_active"]
    
    db.commit()
    db.refresh(user)
    
    return {
        "status": "success",
        "message": f"User {user_id} updated",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }
    }


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Xóa người dùng"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    
    return {
        "status": "success",
        "message": f"User {user_id} deleted"
    }
