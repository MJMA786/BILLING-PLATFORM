from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User, UserRole
from app.repositories.customer_repository import CustomerRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    UserLogin,
    UserRegister,
)


class AuthService:

    @staticmethod
    def register_user(
        db: Session,
        user_data: UserRegister,
    ) -> User:

        existing_user = UserRepository.get_by_email(
            db=db,
            email=user_data.email,
        )

        if existing_user:
            raise ValueError("Email is already registered.")

        hashed_password = hash_password(
            user_data.password,
        )

        user = UserRepository.create_user(
            db=db,
            name=user_data.name,
            email=user_data.email,
            password_hash=hashed_password,
        )

        # Automatically create customer profile
        if user.role == UserRole.CUSTOMER:

            CustomerRepository.create(
                db=db,
                user_id=user.id,
                name=user.name,
                email=user.email,
                billing_country="India",   # Default value
            )

        return user

    @staticmethod
    def login_user(
        db: Session,
        login_data: UserLogin,
    ) -> dict:

        user = UserRepository.get_by_email(
            db=db,
            email=login_data.email,
        )

        if (
            not user
            or not verify_password(
                login_data.password,
                user.password_hash,
            )
        ):
            raise ValueError("Invalid email or password.")

        access_token = create_access_token(
            data={
                "sub": user.email,
                "role": user.role.value,
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
        }

    @staticmethod
    def get_current_user(
        db: Session,
        email: str,
    ) -> User:

        user = UserRepository.get_by_email(
            db=db,
            email=email,
        )

        if not user:
            raise ValueError("User not found.")

        return user

    @staticmethod
    def change_password(
        db: Session,
        user: User,
        current_password: str,
        new_password: str,
    ) -> dict:

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
            new_password,
        )

        UserRepository.update_password(
            db=db,
            user=user,
            new_password_hash=hashed_password,
        )

        return {
            "message": "Password changed successfully."
        }