from pydantic import BaseModel
from datetime import datetime

class SessionCreate(BaseModel):
    class_id: int
    teacher_id: int | None = None  # nếu None sẽ lấy teacher từ Class

class SessionEnd(BaseModel):
    end_time: datetime | None = None  # nếu None = now

class SessionResponse(BaseModel):
    id: int
    class_id: int
    teacher_id: int
    start_time: datetime
    end_time: datetime | None = None

    class Config:
        from_attributes = True
