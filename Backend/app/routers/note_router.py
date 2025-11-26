from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db

from app.models.models import SessionNotes
from app.schemas.schemas import SessionNotesCreate, SessionNotesResponse

router = APIRouter(prefix="/notes", tags=["Session Notes"])


@router.post("/", response_model=SessionNotesResponse)
def update_notes(payload: SessionNotesCreate, db: Session = Depends(get_db)):
    existing = (
        db.query(SessionNotes)
        .filter(SessionNotes.session_id == payload.session_id)
        .first()
    )

    if existing:
        existing.summary = payload.summary
        existing.notes = payload.notes
        db.commit()
        db.refresh(existing)
        return existing

    new_note = SessionNotes(**payload.dict())
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


@router.get("/{session_id}", response_model=SessionNotesResponse)
def get_notes(session_id: int, db: Session = Depends(get_db)):
    note = db.query(SessionNotes).filter(SessionNotes.session_id == session_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="No notes found")
    return note
