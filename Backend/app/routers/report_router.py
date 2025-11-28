from fastapi import APIRouter, Depends, HTTPException
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
    """Tạo báo cáo buổi học"""
    report = SessionReport(**payload.dict())
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/{session_id}")
def list_reports(session_id: int, db: Session = Depends(get_db)):
    """Lấy các báo cáo của buổi học"""
    reports = (
        db.query(SessionReport)
        .filter(SessionReport.session_id == session_id)
        .order_by(SessionReport.exported_at.desc())
        .all()
    )
    
    return {
        "status": "success",
        "data": [
            {
                "id": r.id,
                "session_id": r.session_id,
                "report_format": r.report_format,
                "file_path": r.file_path,
                "file_size_bytes": r.file_size_bytes,
                "exported_by": r.exported_by,
                "exported_at": r.exported_at
            }
            for r in reports
        ]
    }
