from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    full_name = Column(String, index=True, nullable=False)
    email = Column(String, index=True, nullable=False)
    phone = Column(String, nullable=True)
    resume_text = Column(Text, nullable=False)
    parsed_skills = Column(JSON, default=list, nullable=True)
    experience_years = Column(Integer, default=0, nullable=False)
    match_score = Column(Float, default=0.0, nullable=False)
    match_reasons = Column(JSON, default=dict, nullable=True)
    status = Column(String, default="applied", nullable=False)  # applied, screened, interviewed, offered, rejected
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    job = relationship("Job", back_populates="candidates")
    evaluations = relationship("Evaluation", back_populates="candidate", cascade="all, delete-orphan")
