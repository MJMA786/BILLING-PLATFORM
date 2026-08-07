from google.auth.transport import requests
from google.oauth2 import id_token

from app.config.settings import settings


class GoogleAuthService:
    """
    Handles Google OAuth authentication.

    Responsibilities:
    - Verify Google ID Tokens
    - Extract Google user information
    """

    @staticmethod
    def verify_id_token(id_token_str: str) -> dict:
        """
        Verify a Google ID Token and return the user's information.

        Raises:
            ValueError: If the token is invalid or expired.
        """

        try:

            user_info = id_token.verify_oauth2_token(
                id_token_str,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )

            return {
                "google_id": user_info["sub"],
                "email": user_info["email"],
                "name": user_info.get(
                    "name",
                    user_info["email"].split("@")[0],
                ),
                "picture": user_info.get("picture"),
                "email_verified": user_info.get(
                    "email_verified",
                    False,
                ),
            }

        except Exception as exc:
            raise ValueError(
                "Invalid or expired Google ID token."
            ) from exc