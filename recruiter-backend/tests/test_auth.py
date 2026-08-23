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


def test_signup_and_login_flow(client):
    """Test full signup -> login -> /me flow via the conftest-provided TestClient."""
    email = f"recruiter_{uuid.uuid4().hex[:8]}@example.com"
    password = "password123"

    # Signup
    response = client.post(
        "/auth/signup",
        json={"email": email, "password": password, "role": "recruiter"},
    )
    assert response.status_code == 201, response.text
    user_data = response.json()
    assert user_data["email"] == email
    assert user_data["role"] == "recruiter"

    # Login
    login_res = client.post("/auth/login", json={"email": email, "password": password})
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    assert token_data["role"] == "recruiter"

    # /me
    token = token_data["access_token"]
    me_res = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == email


def test_require_role_rbac(client):
    """
    Verify that require_role() enforces role-based access control:
    - A recruiter calling an admin-only route gets 403 Forbidden.
    - An admin calling the same route gets 200 OK.

    FIX: Previously this test spun up a bare FastAPI() without a DB dependency,
    causing get_db to fail. Now uses the conftest-provided client (with DB override)
    and registers the test route directly on the real `app` instance.
    """
    # Register a temporary admin-only route on the real app
    @app.get("/test-rbac-admin-only", tags=["Test"])
    def admin_only_route(user: User = Depends(require_role(UserRole.ADMIN))):
        return {"status": "success", "role": user.role.value}

    # 1. Create and login as recruiter
    rec_email = f"rec_{uuid.uuid4().hex[:8]}@example.com"
    client.post("/auth/signup", json={"email": rec_email, "password": "pass", "role": "recruiter"})
    rec_login = client.post("/auth/login", json={"email": rec_email, "password": "pass"})
    recruiter_token = rec_login.json()["access_token"]

    # Recruiter hits admin-only route -> 403 Forbidden
    res_forbidden = client.get(
        "/test-rbac-admin-only",
        headers={"Authorization": f"Bearer {recruiter_token}"},
    )
    assert res_forbidden.status_code == 403

    # 2. Create and login as admin
    adm_email = f"admin_{uuid.uuid4().hex[:8]}@example.com"
    client.post("/auth/signup", json={"email": adm_email, "password": "pass", "role": "admin"})
    adm_login = client.post("/auth/login", json={"email": adm_email, "password": "pass"})
    admin_token = adm_login.json()["access_token"]

    # Admin hits admin-only route -> 200 OK
    res_ok = client.get(
        "/test-rbac-admin-only",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert res_ok.status_code == 200
    assert res_ok.json()["status"] == "success"
    assert res_ok.json()["role"] == "admin"
