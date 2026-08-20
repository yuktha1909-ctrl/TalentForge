# 🤖 Recruiter AI Agent — Backend Service

> **Track B — Comprehensive Talent Acquisition Platform**  
> Fast, production-ready, demoable Python/FastAPI backend powered by LangGraph, PostgreSQL/SQLite, Redis, SQLAlchemy 2.0, Alembic, and JWT Authentication.

---

## 🚀 Overview & Key Features

- **FastAPI Core**: Asynchronous RESTful API framework with automatically generated Swagger (`/docs`) and ReDoc (`/redoc`) documentation.
- **LangGraph Recruitment Pipeline**: Multi-node agent workflow:
  - `ResumeParserNode`: Extracts skills and experience years from candidate resume text.
  - `JobMatcherNode`: Calculates candidate fit (0–100 match score) against job description requirements.
  - `QuestionGeneratorNode`: Generates tailored technical and behavioral interview questions based on candidate profile and missing skills.
  - `CandidateEvaluatorNode`: Evaluates candidate interview answers and produces structured AI feedback.
- **JWT Authentication**: Recruiter user signup/login using `python-jose` and password hashing with `passlib[bcrypt]`.
- **Database & Migration Engine**: SQLAlchemy 2.0 ORM with PostgreSQL support and SQLite fallback for instant viva/presentation demos.
- **Redis Caching**: Caches candidate match scores and screening outputs to optimize response times.

---

## 🛠️ Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app entry point with CORS & Lifespan
│   ├── core/
│   │   ├── config.py           # Application settings & environment variables
│   │   ├── security.py         # Password hashing & JWT token logic
│   │   ├── database.py         # SQLAlchemy engine & session management
│   │   └── redis.py            # Redis client with in-memory fallback
│   ├── models/                 # SQLAlchemy DB Models (User, Job, Candidate, Evaluation)
│   ├── schemas/                # Pydantic Schemas for requests/responses
│   ├── api/
│   │   ├── deps.py             # Auth & Session dependencies
│   │   └── v1/                 # API Routes (/auth, /jobs, /candidates, /agent)
│   └── agents/                 # LangGraph Agent Engine
│       ├── state.py            # RecruitmentState schema
│       ├── nodes.py            # LangGraph Nodes (Parser, Matcher, Question Generator)
│       └── workflow.py         # Compiled StateGraph pipeline
├── alembic/                    # Migration scripts directory
├── alembic.ini                 # Alembic configuration
├── requirements.txt            # Python dependencies
├── .env.example                # Template environment file
└── .env                        # Active environment configuration
```

---

## ⚙️ Quickstart Setup Guide

### 1. Environment Setup
Make sure you have **Python 3.10+** installed.

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Linux / macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configuration (`.env`)
The `.env` file comes pre-configured with default values for local development.

```env
PROJECT_NAME="Recruiter AI Agent Backend"
DATABASE_URL="sqlite:///./recruiter_ai.db" # Or postgresql://user:pass@localhost:5432/recruiter_ai
REDIS_URL="redis://localhost:6379/0"
SECRET_KEY="super-secret-jwt-key-recruiter-ai-agent-viva-demo"
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-4o-mini"
```

> **Note for Viva/Demo**: If `OPENAI_API_KEY` is not provided, the backend automatically uses intelligent rule-based fallback logic so all agent routes continue to work seamlessly!

### 3. Run Database Migrations (Optional)
```bash
alembic upgrade head
```

### 4. Start the FastAPI Server
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be live at: **`http://127.0.0.1:8000`**  
OpenAPI Interactive Docs: **`http://127.0.0.1:8000/docs`**

---

## 📡 API Endpoint Reference (For Frontend Teammate)

### 🔐 Auth Endpoints (`/api/v1/auth`)
- `POST /api/v1/auth/signup`: Register new recruiter user.
  - Body: `{"email": "recruiter@company.com", "full_name": "Jane Recruiter", "password": "securepassword123"}`
- `POST /api/v1/auth/login`: Authenticate user and retrieve JWT token.
  - Body: `{"email": "recruiter@company.com", "password": "securepassword123"}`
  - Response: `{"access_token": "...", "token_type": "bearer", "user": {...}}`
- `GET /api/v1/auth/me`: Get profile of authenticated user. Requires Header: `Authorization: Bearer <token>`

---

### 💼 Jobs Endpoints (`/api/v1/jobs`) — Requires Auth
- `GET /api/v1/jobs`: List all job postings.
- `POST /api/v1/jobs`: Create a new job description.
  - Body:
    ```json
    {
      "title": "Senior Python Developer",
      "department": "Engineering",
      "description": "Looking for an experienced backend developer skilled in Python and FastAPI.",
      "requirements": "Python, FastAPI, PostgreSQL, Docker, Redis",
      "min_experience_years": 3,
      "status": "open"
    }
    ```
- `GET /api/v1/jobs/{id}`: Get job details.
- `PUT /api/v1/jobs/{id}`: Update job posting.
- `DELETE /api/v1/jobs/{id}`: Delete job posting.

---

### 👤 Candidates Endpoints (`/api/v1/candidates`) — Requires Auth
- `GET /api/v1/candidates?job_id=1`: List applicants.
- `POST /api/v1/candidates`: Submit candidate application with resume text.
  - Body:
    ```json
    {
      "job_id": 1,
      "full_name": "Alex Johnson",
      "email": "alex.johnson@example.com",
      "phone": "+1-555-0199",
      "resume_text": "Experienced Python Engineer with 4 years of experience building scalable backend web apps using FastAPI, PostgreSQL, Redis, and Docker."
    }
    ```

---

### 🤖 AI Agent Endpoints (`/api/v1/agent`) — Requires Auth

#### 1. Candidate Resume Screening & Matching
`POST /api/v1/agent/screen-candidate`
- Triggers the **LangGraph StateGraph Workflow**.
- Request Body: `{"candidate_id": 1}`
- Executes: `ResumeParser` ➔ `JobMatcher` ➔ `QuestionGenerator`.
- Updates Candidate's `match_score`, `parsed_skills`, `match_reasons`, and generates tailored interview questions.

#### 2. Interview Answer Evaluation
`POST /api/v1/agent/evaluate-interview`
- Request Body:
  ```json
  {
    "evaluation_id": 1,
    "candidate_answers": [
      {
        "question": "Can you describe your experience working with FastAPI?",
        "answer": "I built production microservices with FastAPI handling async requests and JWT auth."
      }
    ]
  }
  ```
- Returns AI Feedback and overall rating (1-10).

---

## 🧪 Verification & Testing
To run a quick diagnostic test on the app modules, launch Python interactive shell or uvicorn server:
```bash
python -c "import app.main; print('App successfully initialized!')"
```
