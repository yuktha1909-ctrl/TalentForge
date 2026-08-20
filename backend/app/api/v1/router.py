from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.jobs import router as jobs_router
from app.api.v1.candidates import router as candidates_router
from app.api.v1.agent import router as agent_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(jobs_router)
api_router.include_router(candidates_router)
api_router.include_router(agent_router)
