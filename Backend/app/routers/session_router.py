from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from datetime import datetime
import json

from app.models.models import Session as SessionModel, EmotionReading
from app.schemas.schemas import (
    SessionCreate, 
    SessionResponse, 
    SessionEndRequest, 
    SessionEndResponse,
    EmotionReadingCreate
)

router = APIRouter(prefix="/sessions", tags=["Sessions"])


@router.post("/create")
def create_session(payload: SessionCreate, db: Session = Depends(get_db)):
    try:
        new_session = SessionModel(
            teacher_id=payload.teacher_id,
            subject=payload.subject,
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)

        return {
            "status": "success",
            "session_id": new_session.id,
            "subject": new_session.subject,
            "teacher_id": new_session.teacher_id
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error creating session: {str(e)}")
    


@router.get("/teacher/{teacher_id}", response_model=list[SessionResponse])
def get_sessions_for_teacher(teacher_id: int, db: Session = Depends(get_db)):
    return (
        db.query(SessionModel)
        .filter(SessionModel.teacher_id == teacher_id)
        .order_by(SessionModel.created_at.desc())
        .all()
    )


@router.get("/recent_classes")
def get_recent_classes(db: Session = Depends(get_db), limit: int = 10):
    """Get recent classes for display"""
    try:
        sessions = (
            db.query(SessionModel)
            .order_by(SessionModel.created_at.desc())
            .limit(limit)
            .all()
        )
        
        return {
            "status": "success",
            "data": [
                {
                    "id": s.id,
                    "subject": s.subject,
                    "teacher_id": s.teacher_id,
                    "created_at": s.created_at.isoformat() if s.created_at else None
                }
                for s in sessions
            ]
        }
    except Exception as e:
        return {
            "status": "success",
            "data": []
        }


@router.post("/end_session")
def end_session(payload: SessionEndRequest, db: Session = Depends(get_db)):
    """
    Kết thúc một buổi học và lưu dữ liệu phân tích.
    
    Payload:
    - session_id: ID buổi học (từ localStorage)
    - start_time, end_time: thời gian bắt đầu/kết thúc
    - duration: tổng thời gian (giây)
    - emotion_counts: {emotion: count}
    - timeline: [frame data]
    """
    try:
        # Parse session_id từ string format "session_TIMESTAMP"
        if isinstance(payload.session_id, str):
            session_id_str = payload.session_id
            # Try to find existing session or create new one
            try:
                session_id = int(session_id_str.replace("session_", "")) if session_id_str.startswith("session_") else int(payload.session_id)
            except:
                session_id = int(payload.session_id)
            
            session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
            if not session:
                raise HTTPException(status_code=404, detail="Session not found")
        else:
            session = db.query(SessionModel).filter(SessionModel.id == payload.session_id).first()
            if not session:
                raise HTTPException(status_code=404, detail="Session not found")
        
        # Add emotion readings từ timeline
        for frame_data in payload.timeline:
            emotion_reading = EmotionReading(
                session_id=session.id,
                emotion=frame_data.get("current_emotion", "Neutral"),
                confidence=None,
                face_count=frame_data.get("faces", 0),
                image_path=None
            )
            db.add(emotion_reading)
        
        db.commit()
        db.refresh(session)
        
        return {
            "status": "success",
            "message": f"Session {session.id} ended successfully",
            "session_id": session.id,
            "total_frames": len(payload.timeline),
            "emotion_summary": payload.emotion_counts
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error ending session: {str(e)}")


@router.get("/{session_id}", response_model=SessionResponse)
def get_session(session_id: int, db: Session = Depends(get_db)):
    """Lấy thông tin chi tiết một buổi học"""
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

