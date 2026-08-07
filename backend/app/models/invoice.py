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

class InvoiceStatus(str, Enum):
    DRAFT = "draft"
    OPEN = "open"
    PAID = "paid"
    VOID = "void"
    OVERDUE = "overdue"


# ==========================================================
# Invoice Model
# ==========================================================

class Invoice(Base):
    __tablename__ = "invoices"

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

    billing_cycle_id: Mapped[int] = mapped_column(
        ForeignKey("billing_cycles.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    customer_id: Mapped[int] = mapped_column(
        ForeignKey("customers.id", ondelete="CASCADE"),
        nullable=False,
    )

    # ======================================================
    # Invoice Information
    # ======================================================

    invoice_number: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    # ======================================================
    # Financial Details
    # ======================================================

    subtotal: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    tax_amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        default=0,
        nullable=False,
    )

    discount_amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        default=0,
        nullable=False,
    )

    total: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    currency: Mapped[Currency] = mapped_column(
        nullable=False,
        default=Currency.USD,
    )

    # ======================================================
    # Status
    # ======================================================

    status: Mapped[InvoiceStatus] = mapped_column(
        SqlEnum(InvoiceStatus),
        default=InvoiceStatus.DRAFT,
        nullable=False,
    )

    # ======================================================
    # Dates
    # ======================================================

    issued_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    due_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
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

    billing_cycle: Mapped["BillingCycle"] = relationship(
        "BillingCycle",
        back_populates="invoice",
    )

    customer: Mapped["Customer"] = relationship(
        "Customer",
        back_populates="invoices",
    )

    payments: Mapped[list["Payment"]] = relationship(
        "Payment",
        back_populates="invoice",
        cascade="all, delete-orphan",
    )

    line_items: Mapped[list["InvoiceLineItem"]] = relationship(
        "InvoiceLineItem",
        back_populates="invoice",
        cascade="all, delete-orphan",
    )

    @property
    def customer_name(self) -> str:
        if self.customer:
            return self.customer.company_name or self.customer.contact_person or ""
        if self.billing_cycle and self.billing_cycle.subscription and self.billing_cycle.subscription.customer:
            c = self.billing_cycle.subscription.customer
            return c.company_name or c.contact_person or ""
        return ""

    @property
    def plan_name(self) -> str:
        if self.billing_cycle and self.billing_cycle.subscription and self.billing_cycle.subscription.plan:
            return self.billing_cycle.subscription.plan.name
        return ""