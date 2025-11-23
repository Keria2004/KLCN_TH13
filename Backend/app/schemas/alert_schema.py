from pydantic import BaseModel
from datetime import datetime

class AlertResponse(BaseModel):
    id: int
    session_id: int
    timestamp: datetime
    alert_type: str

    class Config:
        from_attributes = True
