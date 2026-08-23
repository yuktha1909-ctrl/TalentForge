from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    interview_questions = Column(JSON, default=list, nullable=True)
    candidate_answers = Column(JSON, default=list, nullable=True)
    ai_feedback = Column(Text, nullable=True)
    overall_rating = Column(Float, default=0.0, nullable=False)
    status = Column(String, default="pending", nullable=False)  # pending, completed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    candidate = relationship("Candidate", back_populates="evaluations")
    job = relationship("Job", back_populates="evaluations")
