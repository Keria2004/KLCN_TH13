from pydantic import BaseModel
from datetime import datetime
from typing import Any, Dict

class SnapshotCreate(BaseModel):
    session_id: int
    emotion_summary: Dict[str, Any]

class SnapshotResponse(BaseModel):
    id: int
    session_id: int
    timestamp: datetime
    emotion_summary: Dict[str, Any]

    class Config:
        from_attributes = True
