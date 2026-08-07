from datetime import datetime, timedelta, timezone
from typing import Any
from uuid import uuid4

from jose import JWTError, jwt
from pwdlib import PasswordHash

from app.config.settings import settings


# ==========================================================
# Password Hashing (pwdlib)
# ==========================================================

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """
    Hash a plain-text password.
    """
    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify a password against its hash.
    """
    return password_hash.verify(
        plain_password,
        hashed_password,
    )


# ==========================================================
# JWT Configuration
# ==========================================================

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM

ACCESS_TOKEN_EXPIRE_MINUTES = (
    settings.ACCESS_TOKEN_EXPIRE_MINUTES
)

REFRESH_TOKEN_EXPIRE_DAYS = (
    settings.REFRESH_TOKEN_EXPIRE_DAYS
)


# ==========================================================
# Internal JWT Builder
# ==========================================================

def _create_token(
    *,
    email: str,
    token_type: str,
    expires_delta: timedelta,
    role: str,
) -> str:
    """
    Internal helper used to create JWTs.
    """

    now = datetime.now(timezone.utc)

    payload = {
        "sub": email,
        "role": role,
        "type": token_type,

        "iat": now,
        "nbf": now,
        "exp": now + expires_delta,

        "iss": settings.JWT_ISSUER,
        "aud": settings.JWT_AUDIENCE,

        "jti": str(uuid4()),
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


# ==========================================================
# Access Token
# ==========================================================

def create_access_token(
    *,
    email: str,
    role: str,
) -> str:
    """
    Create a short-lived access token.
    """

    return _create_token(
        email=email,
        role=role,
        token_type="access",
        expires_delta=timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES,
        ),
    )


# ==========================================================
# Refresh Token
# ==========================================================

def create_refresh_token(
    *,
    email: str,
    role: str,
) -> str:
    """
    Create a long-lived refresh token.
    """

    return _create_token(
        email=email,
        role=role,
        token_type="refresh",
        expires_delta=timedelta(
            days=REFRESH_TOKEN_EXPIRE_DAYS,
        ),
    )


# ==========================================================
# Access + Refresh Token Pair
# ==========================================================

def create_token_pair(
    *,
    email: str,
    role: str,
) -> dict[str, str]:
    """
    Generate both access and refresh tokens.
    """

    return {
        "access_token": create_access_token(
            email=email,
            role=role,
        ),
        "refresh_token": create_refresh_token(
            email=email,
            role=role,
        ),
        "token_type": "bearer",
    }


# ==========================================================
# Decode JWT
# ==========================================================

def decode_token(
    token: str,
) -> dict[str, Any]:
    """
    Decode and validate a JWT.

    Raises:
        JWTError if invalid or expired.
    """

    return jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM],
        audience=settings.JWT_AUDIENCE,
        issuer=settings.JWT_ISSUER,
    )


# ==========================================================
# Verify Access Token
# ==========================================================

def verify_access_token(
    token: str,
) -> dict[str, Any] | None:
    """
    Verify an access token.

    Returns:
        JWT payload if valid.
        None otherwise.
    """

    try:

        payload = decode_token(token)

        if payload.get("type") != "access":
            return None

        return payload

    except JWTError:
        return None


# ==========================================================
# Verify Refresh Token
# ==========================================================

def verify_refresh_token(
    token: str,
) -> dict[str, Any] | None:
    """
    Verify a refresh token.

    Returns:
        JWT payload if valid.
        None otherwise.
    """

    try:

        payload = decode_token(token)

        if payload.get("type") != "refresh":
            return None

        return payload

    except JWTError:
        return None