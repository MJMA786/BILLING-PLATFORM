from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database.base import Base


class BillingCycleStatus(str, Enum):
    PENDING = "pending"
    INVOICED = "invoiced"


class BillingCycle(Base):
    __tablename__ = "billing_cycles"

    id: Mapped[int] = mapped_column(primary_key=True)

    subscription_id: Mapped[int] = mapped_column(
        ForeignKey("subscriptions.id"),
        nullable=False
    )

    cycle_start: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )

    cycle_end: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )

    status: Mapped[BillingCycleStatus] = mapped_column(
        SQLEnum(BillingCycleStatus),
        nullable=False,
        default=BillingCycleStatus.PENDING
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    subscription = relationship("Subscription")