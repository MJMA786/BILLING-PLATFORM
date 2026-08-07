from datetime import datetime
from decimal import Decimal
from enum import Enum

from sqlalchemy import (
    DateTime,
    Enum as SqlEnum,
    ForeignKey,
    Integer,
    Numeric,
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
from app.core.enums import Currency



# ==========================================================
# Enums
# ==========================================================

class PaymentStatus(str, Enum):
    PENDING = "pending"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    REFUNDED = "refunded"


class PaymentGateway(str, Enum):
    MANUAL = "manual"
    STRIPE = "stripe"
    RAZORPAY = "razorpay"
    PAYPAL = "paypal"


class PaymentMethod(str, Enum):
    CARD = "card"
    UPI = "upi"
    NET_BANKING = "net_banking"
    WALLET = "wallet"
    CASH = "cash"
    BANK_TRANSFER = "bank_transfer"


# ==========================================================
# Payment Model
# ==========================================================

class Payment(Base):
    __tablename__ = "payments"

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

    invoice_id: Mapped[int] = mapped_column(
        ForeignKey("invoices.id", ondelete="CASCADE"),
        nullable=False,
    )

    # ======================================================
    # Financial Details
    # ======================================================

    amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    currency: Mapped[Currency] = mapped_column(
        SqlEnum(Currency),
        default=Currency.USD,
        nullable=False,
    )

    # ======================================================
    # Status
    # ======================================================

    status: Mapped[PaymentStatus] = mapped_column(
        SqlEnum(PaymentStatus),
        default=PaymentStatus.PENDING,
        nullable=False,
    )

    # ======================================================
    # Gateway Information
    # ======================================================

    gateway_name: Mapped[PaymentGateway] = mapped_column(
        SqlEnum(PaymentGateway),
        default=PaymentGateway.MANUAL,
        nullable=False,
    )

    gateway_reference: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    payment_method: Mapped[PaymentMethod | None] = mapped_column(
        SqlEnum(PaymentMethod),
        nullable=True,
    )

    # ======================================================
    # Failure Information
    # ======================================================

    failure_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # ======================================================
    # Dates
    # ======================================================

    attempted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    paid_at: Mapped[datetime | None] = mapped_column(
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

    invoice: Mapped["Invoice"] = relationship(
        "Invoice",
        back_populates="payments",
    )

    retries: Mapped[list["PaymentRetry"]] = relationship(
        "PaymentRetry",
        back_populates="payment",
        cascade="all, delete-orphan",
    )

    @property
    def customer_name(self) -> str:
        if self.invoice:
            if self.invoice.customer:
                return self.invoice.customer.company_name or self.invoice.customer.contact_person or ""
            if (
                self.invoice.billing_cycle
                and self.invoice.billing_cycle.subscription
                and self.invoice.billing_cycle.subscription.customer
            ):
                c = self.invoice.billing_cycle.subscription.customer
                return c.company_name or c.contact_person or ""
        return ""