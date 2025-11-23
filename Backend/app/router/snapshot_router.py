from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.database.connect_db import get_db
from app.models import ClassEmotionSnapshot
from app.schemas.snapshot_schema import SnapshotCreate, SnapshotResponse

router = APIRouter(prefix="/snapshots", tags=["Snapshots"])

@router.post("/", response_model=SnapshotResponse)
def create_snapshot(data: SnapshotCreate, db: Session = Depends(get_db)):
    snap = ClassEmotionSnapshot(
        session_id=data.session_id,
        timestamp=datetime.utcnow(),
        emotion_summary=data.emotion_summary
    )
    db.add(snap)
    db.commit()
    db.refresh(snap)
    return snap

@router.get("/session/{session_id}", response_model=list[SnapshotResponse])
def get_snapshots_by_session(session_id: int, db: Session = Depends(get_db)):
    return db.query(ClassEmotionSnapshot).filter(
        ClassEmotionSnapshot.session_id == session_id
    ).order_by(ClassEmotionSnapshot.timestamp).all()
