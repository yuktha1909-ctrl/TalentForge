from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_post_screen_success():
    payload = {
        "resume_text": "Experienced Python Engineer with 5 years experience in FastAPI, PostgreSQL, and Docker.",
        "job_description": "Looking for a Senior Backend Engineer proficient in Python and microservices."
    }

    response = client.post("/screen", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "verdict" in data
    assert isinstance(data["verdict"], str)
    assert len(data["verdict"]) > 0


def test_post_screen_empty_validation():
    payload = {
        "resume_text": "   ",
        "job_description": "Valid job description"
    }

    response = client.post("/screen", json=payload)
    assert response.status_code == 400
    assert "resume_text must not be empty" in response.json()["detail"]
