from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict


class EvaluationBase(BaseModel):
    candidate_id: int
    job_id: int


class EvaluationCreate(EvaluationBase):
    pass


class InterviewEvaluationRequest(BaseModel):
    evaluation_id: int
    candidate_answers: List[Dict[str, Any]]  # List of {"question": "...", "answer": "..."}


class EvaluationResponse(EvaluationBase):
    id: int
    interview_questions: Optional[List[Dict[str, Any]]] = []
    candidate_answers: Optional[List[Dict[str, Any]]] = []
    ai_feedback: Optional[str] = None
    overall_rating: float = 0.0
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
