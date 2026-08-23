from typing import Callable, List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login/form")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Validate access token and return current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None or not user.is_active:
        raise credentials_exception

    return user


def require_role(*allowed_roles: UserRole) -> Callable:
    """
    Dependency factory that enforces role-based access control (RBAC).

    Usage:
        @router.get("/admin-only")
        def admin_endpoint(user: User = Depends(require_role(UserRole.ADMIN))):
            ...

    Raises:
        401 Unauthorized — if token is missing or invalid.
        403 Forbidden    — if user role is not in allowed_roles.
    """
    def role_checker(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db),
    ) -> User:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        forbidden_exception = HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Insufficient permissions for this action",
        )

        payload = decode_access_token(token)
        if not payload:
            raise credentials_exception

        user_id: str = payload.get("sub")
        if not user_id:
            raise credentials_exception

        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user or not user.is_active:
            raise credentials_exception

        allowed_role_values = [
            r.value if isinstance(r, UserRole) else str(r)
            for r in allowed_roles
        ]

        if user.role.value not in allowed_role_values:
            raise forbidden_exception

        return user

    return role_checker
