"""
test_auth.py — Auth endpoint tests for backend/

Covers: signup, login, JWT decode, /me endpoint, and RBAC via require_role().
Uses the TestClient + SQLite override from conftest.py.
"""
import uuid
import pytest
from fastapi import Depends
from fastapi.testclient import TestClient

from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token,
)
from app.models.user import UserRole


# ──────────────────────────────────────────────
# Unit: Password hashing & JWT
# ──────────────────────────────────────────────

def test_password_hashing():
    raw = "secure-password-123"
    hashed = get_password_hash(raw)
    assert hashed != raw
    assert verify_password(raw, hashed) is True
    assert verify_password("wrong-password", hashed) is False


def test_create_and_decode_access_token():
    token = create_access_token(subject="42")
    payload = decode_access_token(token)
    assert payload is not None
    assert payload["sub"] == "42"
    assert "exp" in payload


# ──────────────────────────────────────────────
# Integration: Signup → Login → /me
# ──────────────────────────────────────────────

def test_signup_new_user(client):
    email = f"recruiter_{uuid.uuid4().hex[:8]}@test.com"
    resp = client.post(
        "/api/v1/auth/signup",
        json={"email": email, "full_name": "Test User", "password": "password123", "role": "recruiter"},
    )
    assert resp.status_code == 201, resp.text
    data = resp.json()
    assert data["email"] == email
    assert data["role"] == "recruiter"
    assert "id" in data


def test_signup_duplicate_email_returns_400(client):
    email = f"dup_{uuid.uuid4().hex[:8]}@test.com"
    payload = {"email": email, "full_name": "Dup User", "password": "pass", "role": "recruiter"}
    client.post("/api/v1/auth/signup", json=payload)
    resp = client.post("/api/v1/auth/signup", json=payload)
    assert resp.status_code == 400
    assert "already exists" in resp.json()["detail"].lower()


def test_login_returns_jwt(client):
    email = f"login_{uuid.uuid4().hex[:8]}@test.com"
    client.post(
        "/api/v1/auth/signup",
        json={"email": email, "full_name": "Login User", "password": "loginpass", "role": "recruiter"},
    )
    resp = client.post("/api/v1/auth/login", json={"email": email, "password": "loginpass"})
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password_returns_401(client):
    email = f"wrongpwd_{uuid.uuid4().hex[:8]}@test.com"
    client.post(
        "/api/v1/auth/signup",
        json={"email": email, "full_name": "Wrong Pwd", "password": "correct", "role": "recruiter"},
    )
    resp = client.post("/api/v1/auth/login", json={"email": email, "password": "incorrect"})
    assert resp.status_code == 401


def test_get_me_with_valid_token(client):
    email = f"me_{uuid.uuid4().hex[:8]}@test.com"
    client.post(
        "/api/v1/auth/signup",
        json={"email": email, "full_name": "Me User", "password": "mepass", "role": "recruiter"},
    )
    login_resp = client.post("/api/v1/auth/login", json={"email": email, "password": "mepass"})
    token = login_resp.json()["access_token"]
    me_resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == email


def test_get_me_without_token_returns_401(client):
    resp = client.get("/api/v1/auth/me")
    assert resp.status_code == 401


# ──────────────────────────────────────────────
# RBAC: require_role() enforcement
# ──────────────────────────────────────────────

def test_require_role_admin_only(client):
    """A recruiter account cannot access admin-only routes; an admin can."""
    from app.api.deps import require_role
    from app.main import app as main_app

    # Register a temporary admin-only route on the main app
    @main_app.get("/test-admin-only-route", tags=["Test"])
    def admin_only(user=Depends(require_role(UserRole.ADMIN))):
        return {"role": user.role.value}

    # Create recruiter
    rec_email = f"rec_{uuid.uuid4().hex[:8]}@test.com"
    client.post(
        "/api/v1/auth/signup",
        json={"email": rec_email, "full_name": "Rec", "password": "p", "role": "recruiter"},
    )
    rec_token = client.post(
        "/api/v1/auth/login", json={"email": rec_email, "password": "p"}
    ).json()["access_token"]

    # Create admin
    adm_email = f"adm_{uuid.uuid4().hex[:8]}@test.com"
    client.post(
        "/api/v1/auth/signup",
        json={"email": adm_email, "full_name": "Adm", "password": "p", "role": "admin"},
    )
    adm_token = client.post(
        "/api/v1/auth/login", json={"email": adm_email, "password": "p"}
    ).json()["access_token"]

    # Recruiter → 403
    r_resp = client.get(
        "/test-admin-only-route", headers={"Authorization": f"Bearer {rec_token}"}
    )
    assert r_resp.status_code == 403

    # Admin → 200
    a_resp = client.get(
        "/test-admin-only-route", headers={"Authorization": f"Bearer {adm_token}"}
    )
    assert a_resp.status_code == 200
    assert a_resp.json()["role"] == "admin"
