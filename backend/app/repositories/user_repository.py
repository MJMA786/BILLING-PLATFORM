from sqlalchemy.orm import Session

from app.models.user import User, UserRole


class UserRepository:
    """
    Repository for all User database operations.
    """

    # ==========================================================
    # Read Operations
    # ==========================================================

    @staticmethod
    def get_by_id(
        db: Session,
        user_id: int,
    ) -> User | None:
        return (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

    @staticmethod
    def get_by_email(
        db: Session,
        email: str,
    ) -> User | None:
        return (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

    @staticmethod
    def get_by_google_id(
        db: Session,
        google_id: str,
    ) -> User | None:
        return (
            db.query(User)
            .filter(User.google_id == google_id)
            .first()
        )

    @staticmethod
    def get_all(
        db: Session,
    ) -> list[User]:
        return (
            db.query(User)
            .order_by(User.id)
            .all()
        )

    # ==========================================================
    # Create
    # ==========================================================

    @staticmethod
    def create_user(
        db: Session,
        name: str,
        email: str,
        password_hash: str | None = None,
        role: UserRole = UserRole.CUSTOMER,
        google_id: str | None = None,
        profile_picture: str | None = None,
    ) -> User:

        user = User(
            name=name,
            email=email,
            password_hash=password_hash,
            role=role,
            google_id=google_id,
            profile_picture=profile_picture,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    # ==========================================================
    # Update
    # ==========================================================

    @staticmethod
    def update(
        db: Session,
        user: User,
    ) -> User:
        """
        Commit any modifications made to a user object.
        """
        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def update_password(
        db: Session,
        user: User,
        new_password_hash: str,
    ) -> User:

        user.password_hash = new_password_hash

        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def update_google_account(
        db: Session,
        user: User,
        google_id: str | None = None,
        profile_picture: str | None = None,
    ) -> User:
        """
        Link or update a Google account.
        """

        if google_id:
            user.google_id = google_id

        if profile_picture:
            user.profile_picture = profile_picture

        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def update_active_status(
        db: Session,
        user: User,
        is_active: bool,
    ) -> User:

        user.is_active = is_active

        db.commit()
        db.refresh(user)

        return user

    # ==========================================================
    # Delete
    # ==========================================================

    @staticmethod
    def delete(
        db: Session,
        user: User,
    ) -> None:

        db.delete(user)
        db.commit()