from pydantic import BaseModel
from datetime import datetime

class ClassSchema(BaseModel):
    id: int
    name: str
    teacher_id: int | None

    class Config:
        from_attributes = True


class SessionSchema(BaseModel):
    id: int
    class_id: int
    start_time: datetime
    end_time: datetime | None

    class Config:
        from_attributes = True
