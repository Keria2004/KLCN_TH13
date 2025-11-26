from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db

from app.models.models import EmotionReading
from app.schemas.schemas import (
    EmotionReadingCreate,
    EmotionReadingResponse
)

router = APIRouter(prefix="/readings", tags=["Emotion Readings"])


@router.post("/", response_model=EmotionReadingResponse)
def create_reading(payload: EmotionReadingCreate, db: Session = Depends(get_db)):
    reading = EmotionReading(**payload.dict())
    db.add(reading)
    db.commit()
    db.refresh(reading)
    return reading


@router.get("/{session_id}", response_model=list[EmotionReadingResponse])
def list_readings(session_id: int, db: Session = Depends(get_db)):
    return (
        db.query(EmotionReading)
        .filter(EmotionReading.session_id == session_id)
        .order_by(EmotionReading.timestamp.desc())
        .all()
    )
