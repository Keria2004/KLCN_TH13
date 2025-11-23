from pydantic import BaseModel
from datetime import datetime

class EmotionRecordCreate(BaseModel):
    session_id: int
    face_id: str
    emotion_id: int
    confidence: float

class EmotionRecordResponse(BaseModel):
    id: int
    session_id: int
    face_id: str
    emotion_id: int
    confidence: float
    timestamp: datetime

    class Config:
        from_attributes = True


class EmotionTypeResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True
