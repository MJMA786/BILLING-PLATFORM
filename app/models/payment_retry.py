from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class RetryOutcome(str, Enum):
    PENDING = "pending"
    SUCCEEDED = "succeeded"
    FAILED = "failed"


class PaymentRetry(Base):
    __tablename__ = "payment_retries"

    id: Mapped[int] = mapped_column(primary_key=True)

    payment_id: Mapped[int] = mapped_column(
        ForeignKey("payments.id"),
        nullable=False
    )

    attempt_number: Mapped[int] = mapped_column(
        nullable=False
    )

    scheduled_for: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )

    outcome: Mapped[RetryOutcome] = mapped_column(
        SQLEnum(RetryOutcome),
        nullable=False,
        default=RetryOutcome.PENDING
    )

    payment = relationship("Payment")