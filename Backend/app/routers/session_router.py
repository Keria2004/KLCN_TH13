from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import json
import os
import base64
from pathlib import Path

from app.database.db import get_db
from app.models.models import Session as SessionModel, EmotionReading
from app.schemas.schemas import (
    SessionCreate, 
    SessionResponse, 
    SessionEndRequest, 
    SessionEndResponse,
)

router = APIRouter(
    prefix="/sessions",
    tags=["Sessions"]
)

# 🎥 Tạo thư mục lưu video nếu chưa tồn tại
VIDEOS_DIR = Path(__file__).parent.parent.parent / "videos" / "sessions"
VIDEOS_DIR.mkdir(parents=True, exist_ok=True)

# =========================================================
# ✔ CREATE SESSION
# =========================================================
@router.post("/create", response_model=dict)
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


# =========================================================
# ✔ GET RECENT SESSIONS  (stable - không redirect)
# =========================================================
@router.get("/recent", response_model=dict)
def get_recent_sessions(db: Session = Depends(get_db), limit: int = 10):
    """Return recent classes (NO slash issues, safe route)"""
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
                    "created_at": s.created_at.isoformat(),
                    "ended_at": s.ended_at.isoformat() if s.ended_at else None,
                    "dominant_emotion": s.dominant_emotion,
                    "positive_rate": s.positive_rate,
                    "emotion_summary": json.loads(s.emotion_summary) if s.emotion_summary else {},
                    "status": s.status
                }
                for s in sessions
            ]
        }
    except Exception as e:
        return {"status": "success", "data": []}


# =========================================================
# ✔ GET RECENT CLASSES (alias for /recent)
# =========================================================
@router.get("/recent_classes", response_model=dict)
def get_recent_classes(db: Session = Depends(get_db), limit: int = 10):
    """Return recent classes - Frontend uses this endpoint"""
    try:
        from sqlalchemy.orm import joinedload
        sessions = (
            db.query(SessionModel)
            .options(joinedload(SessionModel.teacher))
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
                    "teacher_name": s.teacher.full_name if s.teacher else "N/A",
                    "created_at": s.created_at.isoformat(),
                    "ended_at": s.ended_at.isoformat() if s.ended_at else None,
                    "dominant_emotion": s.dominant_emotion,
                    "positive_rate": s.positive_rate,
                    "emotion_summary": json.loads(s.emotion_summary) if s.emotion_summary else {},
                    "status": s.status
                }
                for s in sessions
            ]
        }
    except Exception as e:
        return {"status": "success", "data": []}


# =========================================================
# ✔ GET SESSIONS OF A TEACHER
# =========================================================
@router.get("/teacher/{teacher_id}", response_model=list[SessionResponse])
def get_sessions_for_teacher(teacher_id: int, db: Session = Depends(get_db)):
    return (
        db.query(SessionModel)
        .filter(SessionModel.teacher_id == teacher_id)
        .order_by(SessionModel.created_at.desc())
        .all()
    )


# =========================================================
# ✔ END SESSION
# =========================================================
@router.post("/end", response_model=dict)
def end_session(payload: SessionEndRequest, db: Session = Depends(get_db)):
    """End session and save emotion data"""
    # Parse session_id if it's a string
    session_id = payload.session_id
    if isinstance(session_id, str):
        # Try to extract number from "session_1234" format
        if session_id.startswith("session_"):
            session_id = int(session_id.replace("session_", ""))
        else:
            try:
                session_id = int(session_id)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid session_id format")

    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Update session
    if isinstance(payload.end_time, str):
        session.ended_at = datetime.fromisoformat(payload.end_time.replace('Z', '+00:00'))
    else:
        session.ended_at = payload.end_time
    
    session.status = "ended"
    session.duration_seconds = payload.duration
    session.total_frames = len(payload.timeline)
    session.emotion_summary = json.dumps(payload.emotion_counts)
    
    # 🎥 Lưu video nếu có
    if payload.video_data:
        try:
            # Giả sử video_data là base64 encoded
            video_filename = f"session_{session_id}_{int(datetime.now().timestamp())}.mp4"
            video_path = VIDEOS_DIR / video_filename
            
            # Decode base64 và lưu file
            video_bytes = base64.b64decode(payload.video_data)
            with open(video_path, "wb") as f:
                f.write(video_bytes)
            
            session.video_path = str(video_path)
            print(f"✅ Video saved: {video_path}")
        except Exception as e:
            print(f"❌ Error saving video: {str(e)}")
            # Tiếp tục lưu session ngay cả khi video fail
    
    # Calculate dominant emotion
    if payload.emotion_counts:
        dominant = max(payload.emotion_counts, key=payload.emotion_counts.get)
        session.dominant_emotion = dominant
        
        total = sum(payload.emotion_counts.values())
        positive = payload.emotion_counts.get("Happy", 0) + payload.emotion_counts.get("Surprise", 0)
        session.positive_rate = (positive / total * 100) if total > 0 else 0

    # Save emotion readings
    for frame in payload.timeline:
        reading = EmotionReading(
            session_id=session.id,
            emotion=frame.get("current_emotion", "Neutral"),
            face_count=frame.get("faces", 0),
            confidence=None,
        )
        db.add(reading)

    db.commit()
    db.refresh(session)

    return {
        "status": "success",
        "message": f"Session {session.id} ended successfully",
        "session_id": session.id,
        "total_frames": len(payload.timeline),
        "emotion_summary": payload.emotion_counts
    }


# =========================================================
# ✔ END SESSION (alternative endpoint name)
# =========================================================
@router.post("/end_session", response_model=dict)
def end_session_alt(payload: SessionEndRequest, db: Session = Depends(get_db)):
    """Alternative endpoint name for ending session"""
    return end_session(payload, db)


# =========================================================
# ✔ GET SESSION BY ID
# =========================================================
@router.get("/{session_id}", response_model=dict)
def get_session(session_id: int, db: Session = Depends(get_db)):
    """Get session details by ID"""
    try:
        session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        return {
            "status": "success",
            "id": session.id,
            "subject": session.subject,
            "teacher_id": session.teacher_id,
            "created_at": session.created_at.isoformat(),
            "ended_at": session.ended_at.isoformat() if session.ended_at else None,
            "dominant_emotion": session.dominant_emotion,
            "positive_rate": session.positive_rate,
            "emotion_summary": json.loads(session.emotion_summary) if session.emotion_summary else {},
            "status": session.status
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


