# TalentForge — Autonomous Recruiter AI Agent

> **Full-stack AI recruitment platform** — LangGraph-powered resume screening, role-based multi-user dashboards, PostgreSQL + Redis backend, Next.js frontend.

---

## Team Structure

| Person | Role | Primary Directories |
|---|---|---|
| **Person 1** | Backend / AI / Data | `backend/`, `recruiter-backend/` |
| **Person 2** | Frontend / UI / Deploy | `recruiter-ai-agent/frontend/` |

---

## Project Architecture

```
Recruiter-AI Agent/
├── backend/                    # Full-featured FastAPI backend (LangGraph 4-node pipeline)
│   ├── app/
│   │   ├── agents/             # LangGraph nodes: parse_resume, match_candidate, generate_questions, evaluate_answers
│   │   ├── api/v1/             # REST routes: auth, jobs, candidates, agent
│   │   ├── core/               # config, database (Postgres+SQLite fallback), redis, security
│   │   ├── models/             # SQLAlchemy ORM: User (UserRole enum), Job, Candidate, Evaluation
│   │   └── schemas/            # Pydantic request/response schemas
│   ├── tests/                  # pytest suite (conftest.py with SQLite override)
│   ├── alembic/                # Database migrations
│   ├── requirements.txt
│   └── .env.example
│
├── recruiter-backend/          # Clean backend — proper RBAC, scoring, PDF/DOCX parsing, full test suite
│   ├── app/
│   │   ├── agents/             # screening_graph.py (LangGraph), resume_parser.py, scoring.py
│   │   ├── api/                # auth.py, screening.py routes
│   │   ├── core/               # config, security (require_role RBAC), 
│   │   ├── db/                 # session.py (Postgres→SQLite fallback)
│   │   └── models/             # User (UserRole enum), Candidate
│   ├── tests/                  # 7 test files + conftest.py (SQLite override)
│   ├── docker-compose.yml      # PostgreSQL 16 + Redis 7
│   ├── requirements.txt
│   └── .env.example
│
├── recruiter-ai-agent/
│   └── frontend/               # Next.js 16 + Ant Design + Tailwind CSS
│       ├── src/
│       │   ├── app/            # Pages: login, dashboard/recruiter, dashboard/hiring-manager, dashboard/admin
│       │   ├── context/        # AuthContext.tsx — JWT auth + demo fallback
│       │   ├── lib/            # api.ts — typed fetch client
│       │   └── components/     # layout/ProtectedRoute.tsx — route guard HOC
│       ├── .env.example
│       └── package.json
│
└── .github/
    └── workflows/
        └── ci.yml              # GitHub Actions: pytest + next lint + next build
```

---

## Quick Start — Person 1 (Backend)

### Prerequisites
- Python 3.11+
- Docker Desktop (for PostgreSQL + Redis)
- (Optional) OpenAI API key for AI features

### 1. Start Database Services
```bash
cd recruiter-backend
docker compose up -d
# Postgres on :5432  |  Redis on :6379
```

### 2. Set Up Python Environment
```bash
# In recruiter-backend/
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env — set OPENAI_API_KEY if you want AI screening
```

### 4. Run the Backend
```bash
uvicorn app.main:app --reload --port 8000
# API docs: http://localhost:8000/docs
```

### 5. Run Tests
```bash
# Tests use SQLite automatically — no live DB needed
pytest tests/ -v
```

---

## Quick Start — Person 2 (Frontend)

### Prerequisites
- Node.js 20+
- Backend running on port 8000 (or demo mode works without backend)

### 1. Install Dependencies
```bash
cd recruiter-ai-agent/frontend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Default: NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Dev Server
```bash
npm run dev
# App: http://localhost:3000
```

### 4. Login
- Navigate to `http://localhost:3000/login`
- Use **Quick 1-Click Demo Login** buttons (works without backend)
- Or enter real credentials if the backend is running

---

## User Roles

| Role | Login Key | Capabilities |
|---|---|---|
| **Recruiter** | `recruiter` | View pipeline, source candidates, run AI screening |
| **Hiring Manager** | `hiring_manager` | View shortlists, scorecards, approve/reject |
| **Admin** | `admin` | Manage users, configure LLM models, view audit logs |

---

## Environment Variables Reference

### Backend (`.env`)
| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/recruiter_ai` | Primary DB (SQLite fallback if unreachable) |
| `REDIS_URL` | `redis://localhost:6379/0` | Redis cache (in-memory fallback if unreachable) |
| `SECRET_KEY` | — | JWT signing key (change in production!) |
| `OPENAI_API_KEY` | `""` | OpenAI key (rule-based fallback if empty) |
| `OPENAI_MODEL` | `gpt-4o-mini` | LLM model for screening/evaluation |

### Frontend (`.env.local`)
| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend base URL |

---

## CI/CD

The GitHub Actions pipeline (`.github/workflows/ci.yml`) runs on every push to `main`:

1. **Backend tests** — `pytest recruiter-backend/tests/ -v` (SQLite, no Docker needed)
2. **Frontend lint** — `next lint`
3. **Frontend build** — `next build`

### Deployment

| Service | Platform | Trigger |
|---|---|---|
| Backend | [Railway](https://railway.app) | Push to `main` (uncomment deploy job + set `RAILWAY_TOKEN` secret) |
| Frontend | [Vercel](https://vercel.com) | Push to `main` (uncomment deploy job + set Vercel secrets) |

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/signup` | Public | Register new user |
| `POST` | `/api/v1/auth/login` | Public | Login, get JWT |
| `GET` | `/api/v1/auth/me` | Bearer | Get own profile |
| `GET` | `/api/v1/jobs` | Bearer | List job postings |
| `POST` | `/api/v1/jobs` | Recruiter+ | Create job posting |
| `GET` | `/api/v1/candidates` | Bearer | List candidates |
| `POST` | `/api/v1/candidates` | Recruiter+ | Add candidate |
| `POST` | `/api/v1/agent/screen-candidate` | Recruiter+ | Run AI screening |
| `POST` | `/api/v1/agent/evaluate-interview` | Recruiter+ | Evaluate answers |
| `GET` | `/docs` | Public | Swagger UI |
| `GET` | `/health` | Public | Health check |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | FastAPI + Uvicorn |
| AI / Agent | LangGraph + LangChain + OpenAI |
| Database | PostgreSQL 16 (SQLite fallback) |
| Cache | Redis 7 (in-memory fallback) |
| Auth | JWT (python-jose + passlib bcrypt) |
| ORM | SQLAlchemy 2.0 + Alembic |
| Frontend | Next.js 16 + React 19 |
| UI Library | Ant Design 6 |
| Styling | Tailwind CSS 4 |
| Testing | pytest + FastAPI TestClient |
| CI/CD | GitHub Actions |
| Deployment | Railway (backend) + Vercel (frontend) |
