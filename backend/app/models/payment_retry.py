from datetime import datetime
from enum import Enum

from sqlalchemy import (
    DateTime,
    Enum as SqlEnum,
    ForeignKey,
    Integer,
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

class RetryOutcome(str, Enum):
    PENDING = "pending"
    SUCCEEDED = "succeeded"
    FAILED = "failed"


# ==========================================================
# Payment Retry Model
# ==========================================================

class PaymentRetry(Base):
    __tablename__ = "payment_retries"

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

    payment_id: Mapped[int] = mapped_column(
        ForeignKey("payments.id", ondelete="CASCADE"),
        nullable=False,
    )

    # ======================================================
    # Retry Information
    # ======================================================

    attempt_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    scheduled_for: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    attempted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    outcome: Mapped[RetryOutcome] = mapped_column(
        SqlEnum(RetryOutcome),
        default=RetryOutcome.PENDING,
        nullable=False,
    )

    failure_reason: Mapped[str | None] = mapped_column(
        Text,
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

    payment: Mapped["Payment"] = relationship(
        "Payment",
        back_populates="retries",
    )