from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum as SqlEnum,
    ForeignKey,
    Integer,
    String,
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

class Currency(str, Enum):
    USD = "USD"
    INR = "INR"
    EUR = "EUR"
    GBP = "GBP"
    AED = "AED"


# ==========================================================
# Customer Model
# ==========================================================

class Customer(Base):
    __tablename__ = "customers"

    # ======================================================
    # Primary Key
    # ======================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    # ======================================================
    # User Relationship
    # ======================================================

    # Nullable because customers may be:
    # 1. Self-registered users
    # 2. Admin-created customers
    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        unique=True,
    )

    # ======================================================
    # Company Information
    # ======================================================

    company_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    contact_person: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )

    # ======================================================
    # Billing Information
    # ======================================================

    billing_email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
    )

    phone: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
    )

    # ======================================================
    # Address
    # ======================================================

    address_line1: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )

    address_line2: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )

    city: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )

    state: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )

    postal_code: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
    )

    country: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    # ======================================================
    # Business Information
    # ======================================================

    tax_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )

    # ======================================================
    # Preferences
    # ======================================================

    currency: Mapped[Currency] = mapped_column(
        SqlEnum(Currency),
        default=Currency.USD,
        nullable=False,
    )

    timezone: Mapped[str] = mapped_column(
        String(100),
        default="UTC",
        nullable=False,
    )

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

    # One Customer -> One User
    user: Mapped["User"] = relationship(
        "User",
        back_populates="customer",
    )

    # One Customer -> Many Subscriptions
    subscriptions: Mapped[list["Subscription"]] = relationship(
        "Subscription",
        back_populates="customer",
        cascade="all, delete-orphan",
    )

    # One Customer -> Many Invoices
    invoices: Mapped[list["Invoice"]] = relationship(
        "Invoice",
        back_populates="customer",
        cascade="all, delete-orphan",
    )

    # One Customer -> Many Notifications
    notifications: Mapped[list["Notification"]] = relationship(
        "Notification",
        back_populates="customer",
        cascade="all, delete-orphan",
    )

    # One Customer -> Many Audit Logs
    audit_logs: Mapped[list["AuditLog"]] = relationship(
        "AuditLog",
        back_populates="customer",
        cascade="all, delete-orphan",
    )