from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class InteractionBase(BaseModel):
    hcp_name: str
    specialty: str
    hospital: str
    interaction_type: str
    notes: Optional[str] = None
    summary: Optional[str] = None
    follow_up_date: Optional[date] = None

class InteractionCreate(InteractionBase):
    pass

class InteractionUpdate(BaseModel):
    hcp_name: Optional[str] = None
    specialty: Optional[str] = None
    hospital: Optional[str] = None
    interaction_type: Optional[str] = None
    notes: Optional[str] = None
    summary: Optional[str] = None
    follow_up_date: Optional[date] = None

class InteractionResponse(InteractionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True