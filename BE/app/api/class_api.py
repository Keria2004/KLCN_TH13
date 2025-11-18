from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connect_db import get_db
from app.schemas.classes import ClassSchema, SessionSchema
from app.services.class_service import get_all_classes, get_sessions_by_class

router = APIRouter()

@router.get("/classes", response_model=list[ClassSchema])
def api_get_classes(db: Session = Depends(get_db)):
    return get_all_classes(db)

@router.get("/sessions/{class_id}", response_model=list[SessionSchema])
def api_get_sessions(class_id: int, db: Session = Depends(get_db)):
    return get_sessions_by_class(class_id, db)

