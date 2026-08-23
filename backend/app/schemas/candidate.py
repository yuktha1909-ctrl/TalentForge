from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, ConfigDict


class CandidateBase(BaseModel):
    job_id: int
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    resume_text: str


class CandidateCreate(CandidateBase):
    pass


class CandidateUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    resume_text: Optional[str] = None
    status: Optional[str] = None


class ResumeScreeningRequest(BaseModel):
    candidate_id: int


class CandidateResponse(CandidateBase):
    id: int
    parsed_skills: Optional[List[str]] = []
    experience_years: int = 0
    match_score: float = 0.0
    match_reasons: Optional[Dict[str, Any]] = {}
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
