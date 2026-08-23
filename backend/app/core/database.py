import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

db_url = settings.DATABASE_URL
engine_args = {}

# Try primary DB (PostgreSQL). Fall back to SQLite if unreachable (dev convenience).
try:
    if db_url.startswith("sqlite"):
        engine_args["connect_args"] = {"check_same_thread": False}

    temp_engine = create_engine(db_url, pool_pre_ping=True, **engine_args)
    with temp_engine.connect() as _conn:
        pass
    engine = temp_engine
    logger.info(f"Connected to primary database: {db_url}")

except Exception as exc:
    _warning = (
        "\n"
        "======================================================================\n"
        "⚠️  DATABASE CONNECTION WARNING:\n"
        f"Unable to connect to primary database at '{db_url}'.\n"
        "Falling back to local SQLite database: 'sqlite:///./recruiter_ai.db'\n"
        "To use PostgreSQL, start the database server and set DATABASE_URL.\n"
        "======================================================================\n"
    )
    logger.warning(_warning)
    print(_warning)

    db_url = "sqlite:///./recruiter_ai.db"
    engine = create_engine(
        db_url,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for obtaining database sessions in API endpoints."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
