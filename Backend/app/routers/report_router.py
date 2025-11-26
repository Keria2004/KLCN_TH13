from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db

from app.models.models import SessionReport
from app.schemas.schemas import (
    SessionReportCreate,
    SessionReportResponse
)

router = APIRouter(prefix="/reports", tags=["Session Reports"])


@router.post("/", response_model=SessionReportResponse)
def create_report(payload: SessionReportCreate, db: Session = Depends(get_db)):
    report = SessionReport(**payload.dict())
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/{session_id}", response_model=list[SessionReportResponse])
def list_reports(session_id: int, db: Session = Depends(get_db)):
    return (
        db.query(SessionReport)
        .filter(SessionReport.session_id == session_id)
        .order_by(SessionReport.created_at.desc())
        .all()
    )
