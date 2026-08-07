from datetime import datetime
from enum import Enum

from sqlalchemy import Boolean, DateTime, Enum as SqlEnum, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base



class UserRole(str, Enum):
    ADMIN = "admin"
    CUSTOMER = "customer"


class AuthProvider(str, Enum):
    LOCAL = "local"
    GOOGLE = "google"


class User(Base):
    __tablename__ = "users"

    # -----------------------------
    # Primary Key
    # -----------------------------
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    # -----------------------------
    # Basic Information
    # -----------------------------
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    # -----------------------------
    # Authentication
    # -----------------------------
    password_hash: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    google_id: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=True,
    )

    auth_provider: Mapped[AuthProvider] = mapped_column(
        SqlEnum(AuthProvider),
        default=AuthProvider.LOCAL,
        nullable=False,
    )

    reset_code: Mapped[str | None] = mapped_column(
        String(10),
        nullable=True,
    )

    reset_code_expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # -----------------------------
    # Profile
    # -----------------------------
    profile_picture: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    # -----------------------------
    # Authorization
    # -----------------------------
    role: Mapped[UserRole] = mapped_column(
        SqlEnum(UserRole),
        default=UserRole.CUSTOMER,
        nullable=False,
    )

    # -----------------------------
    # Account Status
    # -----------------------------
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    # -----------------------------
    # Activity
    # -----------------------------
    last_login: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # -----------------------------
    # Timestamps
    # -----------------------------
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # ==========================================================
    # Relationships
    # ==========================================================

    # One User -> One Customer Profile
    customer: Mapped["Customer"] = relationship(
        "Customer",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    # One User -> Many Notifications
    notifications: Mapped[list["Notification"]] = relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    # One User -> Many Audit Logs
    audit_logs: Mapped[list["AuditLog"]] = relationship(
        "AuditLog",
        back_populates="user",
        cascade="all, delete-orphan",
    )