from typing import Annotated

from fastapi import (
    Depends,
    HTTPException,
    status,
)
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.user import (
    User,
    UserRole,
)

from app.repositories.user_repository import UserRepository
from app.services.token_service import TokenService


# ==========================================================
# OAuth2
# ==========================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login",
)


# ==========================================================
# Current User
# ==========================================================

def get_current_user(
    token: Annotated[
        str,
        Depends(oauth2_scheme),
    ],
    db: Annotated[
        Session,
        Depends(get_db),
    ],
) -> User:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token.",
        headers={
            "WWW-Authenticate": "Bearer",
        },
    )

    payload = TokenService.verify_access(
        token,
    )

    if payload is None:
        raise credentials_exception

    email = TokenService.get_subject(
        payload,
    )

    user = UserRepository.get_by_email(
        db=db,
        email=email,
    )

    if user is None:
        raise credentials_exception

    return user


# ==========================================================
# Active User
# ==========================================================

def get_current_active_user(
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ],
) -> User:

    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is inactive.",
        )

    return current_user


# ==========================================================
# Verified User
# ==========================================================

def get_current_verified_user(
    current_user: Annotated[
        User,
        Depends(get_current_active_user),
    ],
) -> User:

    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email address.",
        )

    return current_user


# ==========================================================
# Admin Only
# ==========================================================

def require_admin(
    current_user: Annotated[
        User,
        Depends(get_current_active_user),
    ],
) -> User:

    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )

    return current_user


# ==========================================================
# Customer Only
# ==========================================================

def require_customer(
    current_user: Annotated[
        User,
        Depends(get_current_active_user),
    ],
) -> User:

    if current_user.role != UserRole.CUSTOMER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer access required.",
        )

    return current_user