from sqlalchemy.orm import Session
from app.models.models import Class, Session as SessionModel

def get_all_classes(db: Session):
    return db.query(Class).all()

def get_sessions_by_class(class_id: int, db: Session):
    return db.query(SessionModel).filter(SessionModel.class_id == class_id).all()
