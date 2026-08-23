import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.screening import ScreeningRequest, ScreeningResponse
from app.agents.screening_graph import run_screening_agent

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Candidate Screening"])


@router.post("/screen", response_model=ScreeningResponse, status_code=status.HTTP_200_OK)
def screen_candidate_endpoint(payload: ScreeningRequest):
    """Evaluates candidate resume against job description using LangGraph agent."""
    if not payload.resume_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="resume_text must not be empty."
        )
    if not payload.job_description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="job_description must not be empty."
        )

    try:
        verdict = run_screening_agent(
            resume_text=payload.resume_text,
            job_description=payload.job_description
        )
        return ScreeningResponse(verdict=verdict)
    except Exception as e:
        logger.exception(f"LangGraph screening agent execution failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI screening service failed to process request. Please try again later."
        )
