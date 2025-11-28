from fastapi import APIRouter, Depends, HTTPException
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
    """Tạo emotion reading"""
    reading = EmotionReading(**payload.dict())
    db.add(reading)
    db.commit()
    db.refresh(reading)
    return reading


@router.get("/{session_id}")
def list_readings(session_id: int, limit: int = 100, db: Session = Depends(get_db)):
    """Lấy danh sách emotion readings của buổi học"""
    readings = (
        db.query(EmotionReading)
        .filter(EmotionReading.session_id == session_id)
        .order_by(EmotionReading.frame_number.asc())
        .limit(limit)
        .all()
    )
    
    return {
        "status": "success",
        "total": len(readings),
        "data": [
            {
                "id": r.id,
                "session_id": r.session_id,
                "frame_number": r.frame_number,
                "emotion": r.emotion,
                "confidence": r.confidence,
                "face_count": r.face_count,
                "timestamp": r.timestamp,
                "time_offset_seconds": r.time_offset_seconds,
                "image_path": r.image_path
            }
            for r in readings
        ]
    }


@router.get("/{session_id}/stats")
def get_reading_stats(session_id: int, db: Session = Depends(get_db)):
    """Lấy thống kê cảm xúc của buổi học"""
    readings = (
        db.query(EmotionReading)
        .filter(EmotionReading.session_id == session_id)
        .all()
    )
    
    if not readings:
        raise HTTPException(status_code=404, detail="No readings found")
    
    # Count emotions
    emotion_counts = {}
    for reading in readings:
        emotion_counts[reading.emotion] = emotion_counts.get(reading.emotion, 0) + 1
    
    return {
        "status": "success",
        "total_readings": len(readings),
        "emotion_counts": emotion_counts,
        "dominant_emotion": max(emotion_counts, key=emotion_counts.get) if emotion_counts else "Unknown"
    }
