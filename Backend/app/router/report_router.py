from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database.connect_db import get_db
from app.models import Report, EmotionRecord
from app.schemas.report_schema import ReportResponse

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/generate/{session_id}", response_model=ReportResponse)
def generate_report(session_id: int, db: Session = Depends(get_db)):
    records = db.query(EmotionRecord).filter(EmotionRecord.session_id == session_id).all()
    if not records:
        raise HTTPException(404, "No emotion records for this session")

    report_data = {
        "session_id": session_id,
        "generated_at": str(datetime.utcnow()),
        "records_count": len(records),
        "records": [
            {
                "face_id": r.face_id,
                "emotion_id": r.emotion_id,
                "confidence": r.confidence,
                "timestamp": str(r.timestamp)
            }
            for r in records
        ]
    }

    new_report = Report(session_id=session_id, report_data=report_data, created_at=datetime.utcnow())
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@router.get("/session/{session_id}", response_model=ReportResponse | None)
def get_latest_report(session_id: int, db: Session = Depends(get_db)):
    report = (
        db.query(Report)
        .filter(Report.session_id == session_id)
        .order_by(Report.created_at.desc())
        .first()
    )
    return report
