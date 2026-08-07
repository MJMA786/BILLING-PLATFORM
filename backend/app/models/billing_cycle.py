from datetime import datetime
from enum import Enum

from sqlalchemy import (
    DateTime,
    Enum as SqlEnum,
    ForeignKey,
    Integer,
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

class BillingCycleStatus(str, Enum):
    PENDING = "pending"
    INVOICED = "invoiced"
    COMPLETED = "completed"


# ==========================================================
# Billing Cycle Model
# ==========================================================

class BillingCycle(Base):
    __tablename__ = "billing_cycles"

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

    subscription_id: Mapped[int] = mapped_column(
        ForeignKey("subscriptions.id", ondelete="CASCADE"),
        nullable=False,
    )

    # ======================================================
    # Billing Period
    # ======================================================

    cycle_start: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    cycle_end: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    # ======================================================
    # Status
    # ======================================================

    status: Mapped[BillingCycleStatus] = mapped_column(
        SqlEnum(BillingCycleStatus),
        default=BillingCycleStatus.PENDING,
        nullable=False,
    )

    # When the invoice for this billing cycle was generated
    processed_at: Mapped[datetime | None] = mapped_column(
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

    # Many Billing Cycles -> One Subscription
    subscription: Mapped["Subscription"] = relationship(
        "Subscription",
        back_populates="billing_cycles",
    )

    # One Billing Cycle -> One Invoice
    invoice: Mapped["Invoice"] = relationship(
        "Invoice",
        back_populates="billing_cycle",
        uselist=False,
        cascade="all, delete-orphan",
    )