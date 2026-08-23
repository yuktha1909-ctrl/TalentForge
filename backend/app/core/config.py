import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Recruiter AI Agent Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database (PostgreSQL primary, SQLite fallback handled in database.py)
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/recruiter_ai"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT Security
    SECRET_KEY: str = "super-secret-jwt-key-recruiter-ai-agent-viva-demo"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # LLM Settings
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"

    # CORS Origins for Frontend Teammate (React / Next.js)
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
