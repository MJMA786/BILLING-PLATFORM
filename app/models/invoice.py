from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database.base import Base


class InvoiceStatus(str, Enum):
    DRAFT = "draft"
    OPEN = "open"
    PAID = "paid"
    VOID = "void"


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(primary_key=True)

    billing_cycle_id: Mapped[int] = mapped_column(
        ForeignKey("billing_cycles.id"),
        nullable=False
    )

    invoice_number: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )

    subtotal: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )

    tax_amount: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )

    total: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )

    status: Mapped[InvoiceStatus] = mapped_column(
        SQLEnum(InvoiceStatus),
        nullable=False,
        default=InvoiceStatus.DRAFT
    )

    issued_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    due_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )

    billing_cycle = relationship("BillingCycle")