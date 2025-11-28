from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


# ===========================
#       USER SCHEMAS
# ===========================
class UserBase(BaseModel):
    full_name: str
    email: str
    role: str  # teacher, admin, student


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

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


class SessionUpdate(BaseModel):
    status: Optional[str] = None
    positive_rate: Optional[float] = None
    dominant_emotion: Optional[str] = None
    total_frames: Optional[int] = None
    duration_seconds: Optional[int] = None
    notes: Optional[str] = None


class SessionResponse(SessionBase):
    id: int
    status: str
    created_at: datetime
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    duration_seconds: int
    total_frames: int
    positive_rate: float
    dominant_emotion: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True


# ===========================
#       SESSION ENDING
# ===========================
class SessionEndRequest(BaseModel):
    session_id: int | str  # Accept both int and string (e.g., "session_1234")
    start_time: str | datetime  # Accept ISO string or datetime
    end_time: str | datetime
    duration: int
    subject: Optional[str] = None  # Optional subject
    emotion_counts: Dict[str, int]
    timeline: List[Dict[str, Any]]


class SessionEndResponse(BaseModel):
    status: str = "success"
    message: str
    session_id: int
    total_frames: int
    emotion_summary: Dict[str, int]
    ended_at: Optional[datetime] = None


# ===========================
#       EMOTION READING SCHEMAS
# ===========================
class EmotionReadingBase(BaseModel):
    session_id: int
    frame_number: int
    emotion: str
    confidence: Optional[float] = None
    face_count: Optional[int] = None


class EmotionReadingCreate(EmotionReadingBase):
    time_offset_seconds: Optional[float] = None
    image_path: Optional[str] = None


class EmotionReadingResponse(EmotionReadingBase):
    id: int
    timestamp: datetime
    time_offset_seconds: Optional[float] = None
    image_path: Optional[str] = None

    class Config:
        from_attributes = True


# ===========================
#       SESSION REPORT SCHEMAS
# ===========================
class SessionReportBase(BaseModel):
    session_id: int
    report_format: str  # PDF, CSV, JSON, EXCEL
    file_path: str


class SessionReportCreate(SessionReportBase):
    exported_by: Optional[int] = None


class SessionReportResponse(SessionReportBase):
    id: int
    file_size_bytes: Optional[int] = None
    exported_by: Optional[int] = None
    exported_at: datetime

    class Config:
        from_attributes = True


# ===========================
#       AUTH SCHEMAS
# ===========================
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


class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    role: str = "teacher"


class RegisterResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str

    class Config:
        from_attributes = True


# ===========================
#       ANALYTICS (LOGIC ONLY)
# ===========================
class EmotionFrameData(BaseModel):
    frame: int
    timestamp: Optional[datetime] = None
    current_emotion: str
    positive_rate: float
    faces: int
    emotion_distribution: Dict[str, int]


class AnalyticsRequest(BaseModel):
    timeline: List[Dict[str, Any]]


class AnalyticsResponse(BaseModel):
    total_samples: int
    dominant_emotion: str
    positive_rate: float
    emotion_distribution: Dict[str, int]
    emotion_over_time: List[EmotionFrameData]
    teaching_insights: List[str]


# ===========================
#       DASHBOARD
# ===========================
class DashboardStats(BaseModel):
    total_sessions_today: int
    total_students_monitored: int
    avg_positive_rate: float
    most_common_emotion: str
    total_frames_analyzed: int
    active_sessions: int
