from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
import random
import string

from app.core.security import (
    hash_password,
    verify_password,
)
from app.models.user import User, UserRole
from app.repositories.customer_repository import CustomerRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    UserResponse,
    AuthResponse,
)
from app.services.email_service import EmailService
from app.services.google_auth_service import GoogleAuthService
from app.services.token_service import TokenService


class AuthService:
    """
    Authentication service for Subly.

    Responsibilities:
    - User Registration
    - Email Login
    - Google Login
    - Refresh Tokens
    - Password Management
    """

    # ==========================================================
    # Private Helpers
    # ==========================================================

    @staticmethod
    def _create_customer_profile(
        db: Session,
        user: User,
    ) -> None:
        """
        Automatically create a customer profile
        for customer users.
        """

        if user.role != UserRole.CUSTOMER:
            return

        existing_customer = CustomerRepository.get_by_user_id(
            db,
            user.id,
        )

        if existing_customer:
            return

        CustomerRepository.create(
            db=db,
            user_id=user.id,
            company_name=user.name,
            contact_person=user.name,
            billing_email=user.email,
            country="India",
        )

    @staticmethod
    def _send_welcome_email(
        user: User,
        google_signup: bool = False,
    ) -> None:
        """
        Send welcome email.
        Email failures should never interrupt
        authentication.
        """

        try:

            if google_signup:

                EmailService.send_google_welcome_email(
                    user.email,
                    user.name,
                )

            else:

                EmailService.send_welcome_email(
                    user.email,
                    user.name,
                )

        except Exception:
            pass

    @staticmethod
    def _build_auth_response(
        user: User,
    ) -> AuthResponse:
        """
        Build the authentication response.
        """

        tokens = TokenService.create_token_pair(user)

        return AuthResponse(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            token_type=tokens["token_type"],
            user=UserResponse.model_validate(user),
        )

    # ==========================================================
    # Register User
    # ==========================================================

    @staticmethod
    def register_user(
        db: Session,
        user_data: RegisterRequest,
    ) -> AuthResponse:
        """
        Register a new user.
        """

        existing_user = UserRepository.get_by_email(
            db=db,
            email=user_data.email,
        )

        if existing_user:
            raise ValueError(
                "Email is already registered."
            )

        hashed_password = hash_password(
            user_data.password,
        )

        user = UserRepository.create_user(
            db=db,
            name=user_data.name,
            email=user_data.email,
            password_hash=hashed_password,
            role=UserRole.CUSTOMER,
        )

        AuthService._create_customer_profile(
            db,
            user,
        )

        AuthService._send_welcome_email(
            user,
        )

        return AuthService._build_auth_response(
            user,
        )
        # ==========================================================
    # Email Login
    # ==========================================================

    @staticmethod
    def login_user(
        db: Session,
        login_data: LoginRequest,
    ) -> AuthResponse:
        """
        Authenticate a user using email and password.
        """

        user = UserRepository.get_by_email(
            db=db,
            email=login_data.email,
        )

        if not user:
            raise ValueError(
                "Invalid email or password."
            )

        if not user.password_hash:
            raise ValueError(
                "Please sign in using Google."
            )

        if not verify_password(
            login_data.password,
            user.password_hash,
        ):
            raise ValueError(
                "Invalid email or password."
            )

        if not user.is_active:
            raise ValueError(
                "Your account has been disabled."
            )
        # Update last login
        user.last_login = datetime.now(timezone.utc)

        UserRepository.update(
            db=db,
            user=user,
        )

        return AuthService._build_auth_response(
            user,
        )

    # ==========================================================
    # Google Login
    # ==========================================================

    @staticmethod
    def authenticate_google_user(
        db: Session,
        id_token_str: str,
    ) -> AuthResponse:
        """
        Authenticate a user using Google OAuth.
        """

        google_user = (
            GoogleAuthService.verify_id_token(
                id_token_str
            )
        )

        user = UserRepository.get_by_google_id(
            db=db,
            google_id=google_user["google_id"],
        )

        if not user:

            user = UserRepository.get_by_email(
                db=db,
                email=google_user["email"],
            )

        if not user:

            user = UserRepository.create_user(
                db=db,
                name=google_user["name"],
                email=google_user["email"],
                password_hash=None,
                role=UserRole.CUSTOMER,
                google_id=google_user["google_id"],
                profile_picture=google_user["picture"],
            )

            AuthService._create_customer_profile(
                db,
                user,
            )

            AuthService._send_welcome_email(
                user,
                google_signup=True,
            )

        else:

            updated = False

            if (
                not user.google_id
                and google_user["google_id"]
            ):
                user.google_id = google_user[
                    "google_id"
                ]
                updated = True

            if (
                google_user["picture"]
                and user.profile_picture != google_user["picture"]
            ):
                user.profile_picture = google_user[
                    "picture"
                ]
                updated = True

            if (
                user.name != google_user["name"]
                and google_user["name"]
            ):
                user.name = google_user["name"]
                updated = True

            if updated:
                UserRepository.update(
                    db,
                    user,
                )

            AuthService._create_customer_profile(
                db,
                user,
            )

        if not user.is_active:
            raise ValueError(
                "Your account has been disabled."
            )

        # Update last login
        user.last_login = datetime.now(timezone.utc)

        UserRepository.update(
            db=db,
            user=user,
        )

        return AuthService._build_auth_response(
            user,
        )
        # ==========================================================
    # Refresh Tokens
    # ==========================================================

    @staticmethod
    def refresh_tokens(
        refresh_token: str,
    ) -> dict:
        """
        Generate a new access token using
        a valid refresh token.
        """

        return TokenService.refresh_access_token(
            refresh_token
        )

    # ==========================================================
    # Current User
    # ==========================================================

    @staticmethod
    def get_current_user(
        db: Session,
        email: str,
    ) -> User:
        """
        Return the currently authenticated user.
        """

        user = UserRepository.get_by_email(
            db=db,
            email=email,
        )

        if not user:
            raise ValueError(
                "User not found."
            )

        if not user.is_active:
            raise ValueError(
                "User account is inactive."
            )

        return user

    # ==========================================================
    # Change Password
    # ==========================================================

    @staticmethod
    def change_password(
        db: Session,
        user: User,
        current_password: str,
        new_password: str,
    ) -> dict:
        """
        Change the password of the authenticated user.
        """

        if user.password_hash is None:
            raise ValueError(
                "Google accounts cannot change password until a password is set."
            )

        if not verify_password(
            current_password,
            user.password_hash,
        ):
            raise ValueError(
                "Current password is incorrect."
            )

        if current_password == new_password:
            raise ValueError(
                "New password must be different from the current password."
            )

        hashed_password = hash_password(
            new_password
        )

        UserRepository.update_password(
            db=db,
            user=user,
            new_password_hash=hashed_password,
        )

        return {
            "message": "Password changed successfully."
        }
        # ==========================================================
    # Forgot Password & Reset Code
    # ==========================================================

    @staticmethod
    def forgot_password(
        db: Session,
        email: str,
    ) -> dict:
        """
        Send a 6-digit password reset verification code to the customer email.
        """

        user = UserRepository.get_by_email(
            db=db,
            email=email,
        )

        if not user:
            raise ValueError("No account found with this email address.")

        if not user.is_active:
            raise ValueError("Your account is disabled. Please contact support.")

        # Generate secure 6-digit verification code
        reset_code = "".join(random.choices(string.digits, k=6))
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

        user.reset_code = reset_code
        user.reset_code_expires_at = expires_at

        UserRepository.update(db=db, user=user)

        # Dispatch email
        try:
            EmailService.send_password_reset_code(
                to_email=user.email,
                name=user.name,
                code=reset_code,
            )
        except Exception as e:
            print(f"[ForgotPassword] Email dispatch warning: {e}")

        return {
            "message": "Password reset code sent to your email. Please check your inbox or spam folder."
        }

    @staticmethod
    def verify_reset_code(
        db: Session,
        email: str,
        code: str,
    ) -> dict:
        """
        Verify if the password reset code is valid and not expired.
        """

        user = UserRepository.get_by_email(
            db=db,
            email=email,
        )

        if not user or not user.reset_code or user.reset_code != code.strip():
            raise ValueError("Invalid verification code.")

        if not user.reset_code_expires_at:
            raise ValueError("Verification code expired.")

        now = datetime.now(timezone.utc)
        expires_at = user.reset_code_expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if now > expires_at:
            raise ValueError("Verification code has expired. Please request a new one.")

        return {
            "message": "Verification code is valid."
        }

    # ==========================================================
    # Reset Password
    # ==========================================================

    @staticmethod
    def reset_password(
        db: Session,
        email: str,
        code: str,
        new_password: str,
    ) -> dict:
        """
        Reset user's password after validating verification code.
        """

        user = UserRepository.get_by_email(
            db=db,
            email=email,
        )

        if not user or not user.reset_code or user.reset_code != code.strip():
            raise ValueError("Invalid verification code.")

        if not user.reset_code_expires_at:
            raise ValueError("Verification code expired.")

        now = datetime.now(timezone.utc)
        expires_at = user.reset_code_expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if now > expires_at:
            raise ValueError("Verification code has expired. Please request a new code.")

        # Update password & clear reset code
        hashed_password = hash_password(new_password)
        user.password_hash = hashed_password
        user.reset_code = None
        user.reset_code_expires_at = None

        UserRepository.update(db=db, user=user)

        return {
            "message": "Password reset successfully. You can now sign in with your new password."
        }

    # ==========================================================
    # Logout
    # ==========================================================

    @staticmethod
    def logout_user() -> dict:
        """
        Logout user.

        JWTs are stateless, so logout is handled
        client-side for now.

        Future versions will support refresh-token
        blacklisting using Redis.
        """

        return {
            "message": "Logged out successfully."
        }