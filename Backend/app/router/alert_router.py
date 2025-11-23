from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connect_db import get_db
from app.models import SessionAlert
from app.schemas.alert_schema import AlertResponse

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("/session/{session_id}", response_model=list[AlertResponse])
def get_alerts_by_session(session_id: int, db: Session = Depends(get_db)):
    return db.query(SessionAlert).filter(
        SessionAlert.session_id == session_id
    ).order_by(SessionAlert.timestamp).all()
