import sys
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.models.user import User, UserRole
from app.core.security import get_password_hash

client = TestClient(app)

def seed_and_verify_rbac():
    db = SessionLocal()
    print("--- 1. Seeding Test Users for Each Role ---")
    
    roles_data = [
        ("seed_recruiter@company.com", "pass123", UserRole.RECRUITER),
        ("seed_hm@company.com", "pass123", UserRole.HIRING_MANAGER),
        ("seed_admin@company.com", "pass123", UserRole.ADMIN),
    ]

    seeded_users = {}
    for email, password, role in roles_data:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(
                email=email,
                hashed_password=get_password_hash(password),
                role=role
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        seeded_users[role.value] = (email, password)
        print(f"[SUCCESS] User seeded: email={email}, role={role.value}")

    db.close()

    print("\n--- 2. Testing Authentication & Token Generation for Each Role ---")
    tokens = {}
    for role_name, (email, password) in seeded_users.items():
        res = client.post("/auth/login", json={"email": email, "password": password})
        assert res.status_code == 200, f"Login failed for {email}: {res.text}"
        token_data = res.json()
        assert token_data["role"] == role_name
        tokens[role_name] = token_data["access_token"]
        print(f"[SUCCESS] Auth Login Success for role '{role_name}': JWT Token acquired")

    print("\n--- 3. Verifying /auth/me profile endpoint for Each Role ---")
    for role_name, token in tokens.items():
        res = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200
        assert res.json()["role"] == role_name
        print(f"[SUCCESS] /auth/me verified for role '{role_name}'")

    print("\n[COMPLETE] RBAC & Seeding Verification Complete: All roles seeded and verified successfully!")

if __name__ == "__main__":
    seed_and_verify_rbac()
