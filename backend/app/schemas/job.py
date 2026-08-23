from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class JobBase(BaseModel):
    title: str
    department: str
    description: str
    requirements: str
    min_experience_years: Optional[int] = 0
    status: Optional[str] = "open"


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    min_experience_years: Optional[int] = None
    status: Optional[str] = None


class JobResponse(JobBase):
    id: int
    created_by: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
