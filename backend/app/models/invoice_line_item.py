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



# ==========================================================
# Enums
# ==========================================================

class ItemType(str, Enum):
    PLAN_FEE = "plan_fee"
    ADDON = "addon"
    USAGE_CHARGE = "usage_charge"
    PRORATION_CREDIT = "proration_credit"
    PRORATION_DEBIT = "proration_debit"
    DISCOUNT = "discount"
    TAX = "tax"
    REFUND = "refund"


# ==========================================================
# Invoice Line Item Model
# ==========================================================

class InvoiceLineItem(Base):
    __tablename__ = "invoice_line_items"

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
    # Item Information
    # ======================================================

    item_type: Mapped[ItemType] = mapped_column(
        SqlEnum(ItemType),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    details: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # ======================================================
    # Pricing
    # ======================================================

    quantity: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )

    unit_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    discount_amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        default=0,
        nullable=False,
    )

    tax_amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        default=0,
        nullable=False,
    )

    total_amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    # ======================================================
    # Timestamp
    # ======================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # ======================================================
    # Relationships
    # ======================================================

    invoice: Mapped["Invoice"] = relationship(
        "Invoice",
        back_populates="line_items",
    )