import pytest
from app.agents.screening_graph import screening_agent, run_screening_agent, ScreeningState


def test_graph_compilation():
    """Verify that the StateGraph compiles into a runnable executable."""
    assert screening_agent is not None


def test_screening_agent_invocation():
    """Test invoking the screening agent graph with sample inputs."""
    resume_text = "Senior Python Developer with 5 years experience in FastAPI, PostgreSQL, and Docker."
    job_description = "Looking for a Backend Developer skilled in Python, FastAPI, and database design."

    initial_state: ScreeningState = {
        "resume_text": resume_text,
        "job_description": job_description,
        "response": None
    }

    final_state = screening_agent.invoke(initial_state)

    assert "response" in final_state
    assert final_state["response"] is not None
    assert "Verdict:" in final_state["response"] or len(final_state["response"]) > 0


def test_run_screening_agent_helper():
    """Test the run_screening_agent helper function."""
    resume_text = "Frontend Engineer specialized in React and TypeScript."
    job_description = "Seeking a React developer."

    result = run_screening_agent(resume_text, job_description)
    assert isinstance(result, str)
    assert len(result) > 0
