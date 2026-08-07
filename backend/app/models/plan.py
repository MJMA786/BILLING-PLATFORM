from datetime import datetime
from decimal import Decimal
from enum import Enum

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum as SqlEnum,
    Integer,
    Numeric,
    String,
    Text,
    JSON,
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

class BillingInterval(str, Enum):
    MONTHLY = "monthly"
    ANNUAL = "annual"


class Currency(str, Enum):
    USD = "USD"
    INR = "INR"
    EUR = "EUR"
    GBP = "GBP"
    AED = "AED"


# ==========================================================
# Plan Model
# ==========================================================

class Plan(Base):
    __tablename__ = "plans"

    # ======================================================
    # Primary Key
    # ======================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    # ======================================================
    # Basic Information
    # ======================================================

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )

    slug: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # ======================================================
    # Pricing
    # ======================================================

    price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    currency: Mapped[Currency] = mapped_column(
        SqlEnum(Currency),
        default=Currency.USD,
        nullable=False,
    )

    billing_interval: Mapped[BillingInterval] = mapped_column(
        SqlEnum(BillingInterval),
        nullable=False,
    )

    trial_days: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    # ======================================================
    # Features
    # ======================================================

    features: Mapped[dict] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
    )

    # Example:
    # {
    #     "users": 10,
    #     "storage": "100GB",
    #     "api_access": True,
    #     "priority_support": False
    # }

    # ======================================================
    # Status
    # ======================================================

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
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

    subscriptions: Mapped[list["Subscription"]] = relationship(
        "Subscription",
        back_populates="plan",
    )