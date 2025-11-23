from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.database.connect_db import get_db
from app.models import EmotionRecord, EmotionType
from app.schemas.emotion_schema import (
    EmotionRecordCreate,
    EmotionRecordResponse,
    EmotionTypeResponse,
)

router = APIRouter(prefix="/emotions", tags=["Emotions"])

@router.get("/types", response_model=list[EmotionTypeResponse])
def get_emotion_types(db: Session = Depends(get_db)):
    return db.query(EmotionType).all()

@router.post("/records", response_model=EmotionRecordResponse)
def add_emotion_record(data: EmotionRecordCreate, db: Session = Depends(get_db)):
    rec = EmotionRecord(
        session_id=data.session_id,
        face_id=data.face_id,
        emotion_id=data.emotion_id,
        confidence=data.confidence,
        timestamp=datetime.utcnow()
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec

@router.get("/records/session/{session_id}", response_model=list[EmotionRecordResponse])
def get_emotions_by_session(session_id: int, db: Session = Depends(get_db)):
    return db.query(EmotionRecord).filter(EmotionRecord.session_id == session_id).all()
