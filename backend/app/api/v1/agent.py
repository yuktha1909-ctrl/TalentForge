from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.redis import cache_client
from app.models.candidate import Candidate
from app.models.job import Job
from app.models.evaluation import Evaluation
from app.models.user import User
from app.schemas.candidate import ResumeScreeningRequest, CandidateResponse
from app.schemas.evaluation import InterviewEvaluationRequest, EvaluationResponse
from app.api.deps import get_current_user
from app.agents.workflow import run_screening_pipeline, run_evaluation_pipeline

router = APIRouter(prefix="/agent", tags=["AI Recruitment Agent"])


@router.post("/screen-candidate", response_model=CandidateResponse)
def screen_candidate(
    request: ResumeScreeningRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Trigger LangGraph Agent to parse candidate resume, calculate job match score, and generate interview questions."""
    candidate = db.query(Candidate).filter(Candidate.id == request.candidate_id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {request.candidate_id} not found."
        )

    job = db.query(Job).filter(Job.id == candidate.job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job posting associated with candidate not found."
        )

    # Check cache first
    cache_key = f"candidate_screening:{candidate.id}"
    cached_data = cache_client.get(cache_key)
    if cached_data:
        # If score is already computed & cached, update DB and return
        candidate.parsed_skills = cached_data.get("parsed_skills", candidate.parsed_skills)
        candidate.experience_years = cached_data.get("experience_years", candidate.experience_years)
        candidate.match_score = cached_data.get("match_score", candidate.match_score)
        candidate.match_reasons = cached_data.get("match_reasons", candidate.match_reasons)
        candidate.status = "screened"
        db.commit()
        db.refresh(candidate)
        return candidate

    # Construct initial state for LangGraph pipeline
    initial_state = {
        "candidate_id": candidate.id,
        "job_id": job.id,
        "resume_text": candidate.resume_text,
        "job_title": job.title,
        "job_requirements": job.requirements,
        "parsed_skills": [],
        "experience_years": 0,
        "match_score": 0.0,
        "match_reasons": {},
        "interview_questions": [],
        "candidate_answers": [],
        "ai_feedback": "",
        "overall_rating": 0.0,
        "error": None
    }

    # Execute LangGraph workflow
    result_state = run_screening_pipeline(initial_state)

    # Update Candidate record in Database
    candidate.parsed_skills = result_state.get("parsed_skills", [])
    candidate.experience_years = result_state.get("experience_years", 0)
    candidate.match_score = result_state.get("match_score", 0.0)
    candidate.match_reasons = result_state.get("match_reasons", {})
    candidate.status = "screened"

    db.commit()
    db.refresh(candidate)

    # Store or Update Evaluation record for Interview Questions
    evaluation = db.query(Evaluation).filter(
        Evaluation.candidate_id == candidate.id,
        Evaluation.job_id == job.id
    ).first()

    if not evaluation:
        evaluation = Evaluation(
            candidate_id=candidate.id,
            job_id=job.id,
            interview_questions=result_state.get("interview_questions", []),
            status="pending"
        )
        db.add(evaluation)
    else:
        evaluation.interview_questions = result_state.get("interview_questions", [])

    db.commit()

    # Cache screening output in Redis for 1 hour
    cache_client.set(
        cache_key,
        {
            "parsed_skills": candidate.parsed_skills,
            "experience_years": candidate.experience_years,
            "match_score": candidate.match_score,
            "match_reasons": candidate.match_reasons
        },
        expire_seconds=3600
    )

    return candidate


@router.post("/evaluate-interview", response_model=EvaluationResponse)
def evaluate_interview(
    request: InterviewEvaluationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Trigger LangGraph Agent to evaluate candidate interview answers and generate feedback."""
    evaluation = db.query(Evaluation).filter(Evaluation.id == request.evaluation_id).first()
    if not evaluation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evaluation with ID {request.evaluation_id} not found."
        )

    candidate = db.query(Candidate).filter(Candidate.id == evaluation.candidate_id).first()
    
    initial_state = {
        "candidate_id": evaluation.candidate_id,
        "job_id": evaluation.job_id,
        "resume_text": candidate.resume_text if candidate else "",
        "job_title": "",
        "job_requirements": "",
        "parsed_skills": [],
        "experience_years": 0,
        "match_score": 0.0,
        "match_reasons": {},
        "interview_questions": evaluation.interview_questions or [],
        "candidate_answers": request.candidate_answers,
        "ai_feedback": "",
        "overall_rating": 0.0,
        "error": None
    }

    result_state = run_evaluation_pipeline(initial_state)

    evaluation.candidate_answers = request.candidate_answers
    evaluation.ai_feedback = result_state.get("ai_feedback", "")
    evaluation.overall_rating = result_state.get("overall_rating", 0.0)
    evaluation.status = "completed"

    if candidate:
        candidate.status = "interviewed"

    db.commit()
    db.refresh(evaluation)
    return evaluation
