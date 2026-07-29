from enum import Enum

from sqlalchemy import Enum as SQLEnum, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class ItemType(str, Enum):
    PLAN_FEE = "plan_fee"
    PRORATION_CREDIT = "proration_credit"
    PRORATION_DEBIT = "proration_debit"
    USAGE_CHARGE = "usage_charge"
    TAX = "tax"
    REFUND = "refund"


class InvoiceLineItem(Base):
    __tablename__ = "invoice_line_items"

    id: Mapped[int] = mapped_column(primary_key=True)

    invoice_id: Mapped[int] = mapped_column(
        ForeignKey("invoices.id"),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    item_type: Mapped[ItemType] = mapped_column(
        SQLEnum(ItemType),
        nullable=False
    )

    amount: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )

    invoice = relationship("Invoice")