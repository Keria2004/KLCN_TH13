from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from app.database.connect_db import get_db
from app.models import Session as SessionModel, Class
from app.schemas.session_schema import SessionCreate, SessionEnd, SessionResponse

router = APIRouter(prefix="/sessions", tags=["Sessions"])

@router.post("/", response_model=SessionResponse)
def create_session(data: SessionCreate, db: Session = Depends(get_db)):
    # nếu teacher_id không truyền lên -> lấy từ Class
    teacher_id = data.teacher_id
    if teacher_id is None:
        cls = db.query(Class).filter(Class.id == data.class_id).first()
        if not cls or cls.teacher_id is None:
            raise HTTPException(400, "Teacher not found for this class")
        teacher_id = cls.teacher_id

    s = SessionModel(
        class_id=data.class_id,
        teacher_id=teacher_id,
        start_time=datetime.utcnow()
    )
    db.add(s)
    db.commit()
    db.refresh(s)
    return s

@router.post("/{session_id}/end", response_model=SessionResponse)
def end_session(session_id: int, data: SessionEnd, db: Session = Depends(get_db)):
    s = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not s:
        raise HTTPException(404, "Session not found")

    s.end_time = data.end_time or datetime.utcnow()
    db.commit()
    db.refresh(s)
    return s

@router.get("/", response_model=list[SessionResponse])
def list_sessions(
    db: Session = Depends(get_db),
    class_id: int | None = Query(default=None),
    teacher_id: int | None = Query(default=None),
    active: bool | None = Query(default=None)
):
    q = db.query(SessionModel)
    if class_id is not None:
        q = q.filter(SessionModel.class_id == class_id)
    if teacher_id is not None:
        q = q.filter(SessionModel.teacher_id == teacher_id)
    if active is True:
        q = q.filter(SessionModel.end_time.is_(None))
    return q.all()
