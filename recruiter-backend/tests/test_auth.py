import uuid
import pytest
from fastapi import FastAPI, Depends
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token,
    require_role
)
from app.models.user import User, UserRole

client = TestClient(app)


def test_password_hashing():
    raw = "secret123"
    hashed = get_password_hash(raw)
    assert hashed != raw
    assert verify_password(raw, hashed) is True
    assert verify_password("wrongpassword", hashed) is False


def test_create_and_decode_token():
    payload = {"sub": "1", "role": "recruiter"}
    token = create_access_token(payload)
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "1"
    assert decoded["role"] == "recruiter"
    assert "exp" in decoded


def test_signup_and_login_flow():
    # Test Signup with unique email
    email = f"recruiter_{uuid.uuid4().hex[:8]}@example.com"
    password = "password123"
    signup_payload = {
        "email": email,
        "password": password,
        "role": "recruiter"
    }

    response = client.post("/auth/signup", json=signup_payload)
    assert response.status_code == 201
    user_data = response.json()
    assert user_data["email"] == email
    assert user_data["role"] == "recruiter"

    # Test Login
    login_payload = {
        "email": email,
        "password": password
    }
    login_res = client.post("/auth/login", json=login_payload)
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    assert token_data["role"] == "recruiter"

    # Test /auth/me
    token = token_data["access_token"]
    me_res = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == email


def test_require_role_rbac():
    test_app = FastAPI()
    
    @test_app.get("/admin-only")
    def admin_route(user: User = Depends(require_role(UserRole.ADMIN))):
        return {"status": "success", "user": user.email}

    test_client = TestClient(test_app)

    # 1. Login as recruiter
    rec_email = f"rec_{uuid.uuid4().hex[:8]}@example.com"
    signup_payload = {"email": rec_email, "password": "pass", "role": "recruiter"}
    client.post("/auth/signup", json=signup_payload)
    login_res = client.post("/auth/login", json={"email": rec_email, "password": "pass"})
    recruiter_token = login_res.json()["access_token"]

    # Attempt admin endpoint -> 403 Forbidden
    res_forbidden = test_client.get("/admin-only", headers={"Authorization": f"Bearer {recruiter_token}"})
    assert res_forbidden.status_code == 403

    # 2. Login as admin
    adm_email = f"admin_{uuid.uuid4().hex[:8]}@example.com"
    admin_signup = {"email": adm_email, "password": "pass", "role": "admin"}
    client.post("/auth/signup", json=admin_signup)
    admin_login = client.post("/auth/login", json={"email": adm_email, "password": "pass"})
    admin_token = admin_login.json()["access_token"]

    # Attempt admin endpoint -> 200 OK
    res_ok = test_client.get("/admin-only", headers={"Authorization": f"Bearer {admin_token}"})
    assert res_ok.status_code == 200
    assert res_ok.json()["status"] == "success"
