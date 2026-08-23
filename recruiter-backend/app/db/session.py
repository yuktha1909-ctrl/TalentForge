import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

db_url = settings.DATABASE_URL
engine_args = {}

# Try initializing target DB engine (PostgreSQL by default). Fall back to SQLite if Postgres unreachable.
try:
    if db_url.startswith("sqlite"):
        engine_args["connect_args"] = {"check_same_thread": False}

    temp_engine = create_engine(db_url, pool_pre_ping=True, **engine_args)
    # Test connection against database
    with temp_engine.connect() as conn:
        pass
    engine = temp_engine
    logger.info(f"Connected to primary database successfully: {db_url}")
except Exception as e:
    warning_msg = (
        "\n"
        "========================================================================\n"
        "⚠️  DATABASE CONNECTION WARNING:\n"
        f"Unable to connect to primary database at '{db_url}'.\n"
        "Falling back to local SQLite database: 'sqlite:///./recruiter_test.db'\n"
        "To use PostgreSQL, ensure Docker Desktop is running (`docker compose up -d`).\n"
        "========================================================================\n"
    )
    logger.warning(warning_msg)
    print(warning_msg)  # Print to stdout so it appears clearly in server logs
    
    db_url = "sqlite:///./recruiter_test.db"
    engine_args = {"connect_args": {"check_same_thread": False}}
    engine = create_engine(db_url, **engine_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency for obtaining database sessions in API endpoints."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
