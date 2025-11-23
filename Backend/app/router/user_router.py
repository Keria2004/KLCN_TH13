from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connect_db import get_db
from app.models import User
from app.schemas.user_schema import UserResponse

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()
