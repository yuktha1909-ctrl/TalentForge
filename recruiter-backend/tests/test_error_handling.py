from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient
from app.main import app

# Pass raise_server_exceptions=False so TestClient returns HTTP 500 JSON response
client = TestClient(app, raise_server_exceptions=False)


def test_global_500_exception_handler():
    """Verify that unhandled server exceptions trigger global 500 handler returning generic JSON without leaking stack trace."""
    @app.get("/test-unhandled-crash")
    def crash_endpoint():
        raise RuntimeError("Internal database crash with sensitive connection details")

    response = client.get("/test-unhandled-crash")
    assert response.status_code == 500
    data = response.json()
    assert data["detail"] == "An internal server error occurred. Please try again later."
    # Ensure sensitive stack trace details are NOT present in client response
    assert "sensitive connection details" not in str(data)
    assert "RuntimeError" not in str(data)


def test_screen_502_on_agent_failure():
    """Verify that a failure during LangGraph agent execution returns a 502 Bad Gateway response."""
    payload = {
        "resume_text": "Experienced Python Engineer",
        "job_description": "Looking for a Python Backend Developer"
    }

    with patch("app.api.screening.run_screening_agent", side_effect=RuntimeError("LangGraph execution timeout")):
        response = client.post("/screen", json=payload)
        assert response.status_code == 502
        data = response.json()
        assert data["detail"] == "AI screening service failed to process request. Please try again later."
        assert "LangGraph execution timeout" not in str(data)
