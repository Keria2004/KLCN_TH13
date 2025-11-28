from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db

from app.models.models import Session as SessionModel
from pydantic import BaseModel

router = APIRouter(prefix="/notes", tags=["Session Notes"])


class NoteUpdate(BaseModel):
    notes: str


@router.post("/{session_id}")
def update_notes(session_id: int, payload: NoteUpdate, db: Session = Depends(get_db)):
    """Cập nhật ghi chú buổi học"""
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.notes = payload.notes
    db.commit()
    db.refresh(session)
    
    return {
        "status": "success",
        "message": f"Notes updated for session {session_id}",
        "session_id": session_id,
        "notes": session.notes
    }


@router.get("/{session_id}")
def get_notes(session_id: int, db: Session = Depends(get_db)):
    """Lấy ghi chú buổi học"""
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "status": "success",
        "session_id": session_id,
        "notes": session.notes or ""
    }
