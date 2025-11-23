from pydantic import BaseModel

class ClassBase(BaseModel):
    name: str
    teacher_id: int | None = None

class ClassCreate(ClassBase):
    pass

class ClassUpdate(BaseModel):
    name: str | None = None
    teacher_id: int | None = None

class ClassResponse(ClassBase):
    id: int

    class Config:
        from_attributes = True
