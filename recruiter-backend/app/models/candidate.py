from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from app.db.session import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    resume_text = Column(Text, nullable=True)
    keywords = Column(Text, nullable=True)  # Stores comma-separated skills
    score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
