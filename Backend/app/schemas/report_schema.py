from pydantic import BaseModel
from datetime import datetime
from typing import Any, Dict

class ReportResponse(BaseModel):
    id: int
    session_id: int
    created_at: datetime | None = None
    report_data: Dict[str, Any]

    class Config:
        from_attributes = True
