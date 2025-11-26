from datetime import datetime
from pydantic import BaseModel


# ===========================
#       USER SCHEMAS
# ===========================
class UserBase(BaseModel):
    full_name: str
    email: str
    role: str

class UserCreate(UserBase):
    password_hash: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ===========================
#       SESSION SCHEMAS
# ===========================
class SessionBase(BaseModel):
    teacher_id: int
    subject: str

class SessionCreate(SessionBase):
    pass

class SessionResponse(SessionBase):
    id: int
    status: str = "active"  # 'active' | 'closed'
    created_at: datetime
    ended_at: datetime | None = None
    duration_seconds: int | None = None
    total_frames: int = 0
    emotion_summary: dict | None = None

    class Config:
        from_attributes = True


# ===========================
#      SESSION END SCHEMAS
# ===========================
class SessionEndRequest(BaseModel):
    """Data sent when ending a session from Frontend"""
    session_id: str  # string format from frontend
    start_time: datetime
    end_time: datetime
    duration: int  # seconds
    emotion_counts: dict  # {emotion: count}
    timeline: list  # [frame data]


class SessionEndResponse(BaseModel):
    """Response when session is successfully ended"""
    status: str = "success"
    message: str
    session_id: int
    total_frames: int
    emotion_summary: dict
    ended_at: datetime


# ===========================
#  EMOTION READINGS SCHEMAS
# ===========================
class EmotionReadingBase(BaseModel):
    session_id: int
    emotion: str
    confidence: float | None = None
    face_count: int | None = None
    image_path: str | None = None

class EmotionReadingCreate(EmotionReadingBase):
    pass

class EmotionReadingResponse(EmotionReadingBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True


# ===========================
#     SESSION NOTES SCHEMAS
# ===========================
class SessionNotesBase(BaseModel):
    summary: str | None = None
    notes: str | None = None

class SessionNotesCreate(SessionNotesBase):
    session_id: int

class SessionNotesResponse(SessionNotesBase):
    id: int
    session_id: int

    class Config:
        from_attributes = True


# ===========================
#     SESSION REPORT SCHEMAS
# ===========================
class SessionReportBase(BaseModel):
    session_id: int
    file_path: str
    exported_by: int | None = None

class SessionReportCreate(SessionReportBase):
    pass

class SessionReportResponse(SessionReportBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    token: str

    class Config:
        from_attributes = True