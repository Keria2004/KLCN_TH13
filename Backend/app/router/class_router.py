from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connect_db import get_db
from app.models import Class
from app.schemas.class_schema import ClassCreate, ClassUpdate, ClassResponse

router = APIRouter(prefix="/classes", tags=["Classes"])

@router.post("/", response_model=ClassResponse)
def create_class(data: ClassCreate, db: Session = Depends(get_db)):
    new_class = Class(name=data.name, teacher_id=data.teacher_id)
    db.add(new_class)
    db.commit()
    db.refresh(new_class)
    return new_class

@router.get("/", response_model=list[ClassResponse])
def list_classes(db: Session = Depends(get_db)):
    return db.query(Class).all()

@router.get("/{class_id}", response_model=ClassResponse)
def get_class(class_id: int, db: Session = Depends(get_db)):
    cls = db.query(Class).filter(Class.id == class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    return cls

@router.put("/{class_id}", response_model=ClassResponse)
def update_class(class_id: int, data: ClassUpdate, db: Session = Depends(get_db)):
    cls = db.query(Class).filter(Class.id == class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")

    if data.name is not None:
        cls.name = data.name
    if data.teacher_id is not None:
        cls.teacher_id = data.teacher_id

    db.commit()
    db.refresh(cls)
    return cls

@router.delete("/{class_id}")
def delete_class(class_id: int, db: Session = Depends(get_db)):
    cls = db.query(Class).filter(Class.id == class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    db.delete(cls)
    db.commit()
    return {"message": "Class deleted"}
