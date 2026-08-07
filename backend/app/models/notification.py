from datetime import datetime
from enum import Enum

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum as SqlEnum,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.base import Base


# ==========================================================
# Enums
# ==========================================================

class NotificationType(str, Enum):
    EMAIL = "email"
    IN_APP = "in_app"
    PUSH = "push"
    SMS = "sms"


class NotificationStatus(str, Enum):
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"
    READ = "read"


# ==========================================================
# Notification Model
# ==========================================================

class Notification(Base):
    __tablename__ = "notifications"

    # ======================================================
    # Primary Key
    # ======================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    # ======================================================
    # Relationships
    # ======================================================

    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
    )

    customer_id: Mapped[int | None] = mapped_column(
        ForeignKey("customers.id", ondelete="CASCADE"),
        nullable=True,
    )

    # ======================================================
    # Notification Content
    # ======================================================

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # ======================================================
    # Type & Status
    # ======================================================

    notification_type: Mapped[NotificationType] = mapped_column(
        SqlEnum(NotificationType),
        nullable=False,
    )

    status: Mapped[NotificationStatus] = mapped_column(
        SqlEnum(NotificationStatus),
        default=NotificationStatus.PENDING,
        nullable=False,
    )

    # ======================================================
    # Flags
    # ======================================================

    is_read: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    # ======================================================
    # Dates
    # ======================================================

    sent_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    read_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # ======================================================
    # Timestamps
    # ======================================================

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

    # ======================================================
    # Relationships
    # ======================================================

    user: Mapped["User"] = relationship(
        "User",
        back_populates="notifications",
    )

    customer: Mapped["Customer"] = relationship(
        "Customer",
        back_populates="notifications",
    )