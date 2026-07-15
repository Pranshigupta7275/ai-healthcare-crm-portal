import datetime
from sqlalchemy import Column, Integer, String, Text, Date, DateTime
from app.database.database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String(255), nullable=False, index=True)
    specialty = Column(String(255), nullable=False)
    hospital = Column(String(255), nullable=False)
    interaction_type = Column(String(100), nullable=False) # e.g., In-Person, Call, Email
    notes = Column(Text, nullable=True)
    summary = Column(Text, nullable=True) # Populated via LLM in Phase 3
    follow_up_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)