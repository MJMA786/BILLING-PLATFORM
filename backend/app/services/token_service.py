from typing import Any

from app.core.security import (
    create_token_pair,
    decode_token,
    verify_access_token,
    verify_refresh_token,
)

class TokenService:
    """
    Handles all JWT-related operations.

    Responsibilities:
    - Generate JWT access & refresh tokens
    - Refresh access tokens
    - Decode JWTs
    - Validate access tokens
    - Validate refresh tokens
    - Extract user information from JWT payloads
    """

    # ==========================================================
    # Generate Token Pair
    # ==========================================================

    @staticmethod
    def create_token_pair(
        user: User,
    ) -> dict[str, Any]:
        """
        Generate a new access token and refresh token
        for the authenticated user.
        """

        return create_token_pair(
            email=user.email,
            role=user.role.value,
        )

    # ==========================================================
    # Verify Access Token
    # ==========================================================

    @staticmethod
    def verify_access(
        token: str,
    ) -> dict[str, Any] | None:
        """
        Verify an access token.
        """

        return verify_access_token(token)

    # ==========================================================
    # Verify Refresh Token
    # ==========================================================

    @staticmethod
    def verify_refresh(
        token: str,
    ) -> dict[str, Any] | None:
        """
        Verify a refresh token.
        """

        return verify_refresh_token(token)

    # ==========================================================
    # Decode JWT
    # ==========================================================

    @staticmethod
    def decode(
        token: str,
    ) -> dict[str, Any]:
        """
        Decode any JWT.
        """

        return decode_token(token)

    # ==========================================================
    # Extract Email
    # ==========================================================

    @staticmethod
    def get_subject(
        payload: dict[str, Any],
    ) -> str:
        """
        Extract the user's email.
        """

        return payload["sub"]

    # ==========================================================
    # Extract Role
    # ==========================================================

    @staticmethod
    def get_role(
        payload: dict[str, Any],
    ) -> str:
        """
        Extract the user's role.
        """

        return payload.get(
            "role",
            "customer",
        )

    # ==========================================================
    # Refresh Tokens
    # ==========================================================

    @staticmethod
    def refresh_tokens(
        refresh_token: str,
    ) -> dict[str, Any]:
        """
        Generate a fresh access token and refresh token
        from a valid refresh token.
        """

        payload = verify_refresh_token(
            refresh_token
        )

        if payload is None:
            raise ValueError(
                "Invalid or expired refresh token."
            )

        email = TokenService.get_subject(
            payload
        )

        role = TokenService.get_role(
            payload
        )

        return create_token_pair(
            email=email,
            role=role,
        )