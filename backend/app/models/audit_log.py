from datetime import datetime
from enum import Enum

from sqlalchemy import (
    DateTime,
    Enum as SqlEnum,
    ForeignKey,
    Integer,
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

class AuditEntityType(str, Enum):
    USER = "user"
    CUSTOMER = "customer"
    PLAN = "plan"
    SUBSCRIPTION = "subscription"
    BILLING_CYCLE = "billing_cycle"
    INVOICE = "invoice"
    INVOICE_LINE_ITEM = "invoice_line_item"
    PAYMENT = "payment"
    PAYMENT_RETRY = "payment_retry"
    NOTIFICATION = "notification"
    SYSTEM_SETTINGS = "system_settings"


class AuditEvent(str, Enum):
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"

    LOGIN = "login"
    LOGOUT = "logout"
    REGISTER = "register"

    VERIFY_EMAIL = "verify_email"
    PASSWORD_RESET = "password_reset"

    SUBSCRIPTION_CREATED = "subscription_created"
    SUBSCRIPTION_UPDATED = "subscription_updated"
    SUBSCRIPTION_CANCELLED = "subscription_cancelled"

    INVOICE_GENERATED = "invoice_generated"

    PAYMENT_SUCCESS = "payment_success"
    PAYMENT_FAILED = "payment_failed"
    PAYMENT_REFUNDED = "payment_refunded"

    NOTIFICATION_SENT = "notification_sent"


# ==========================================================
# Audit Log Model
# ==========================================================

class AuditLog(Base):
    __tablename__ = "audit_logs"

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

    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    customer_id: Mapped[int | None] = mapped_column(
        ForeignKey("customers.id", ondelete="SET NULL"),
        nullable=True,
    )

    # ======================================================
    # Audit Information
    # ======================================================

    entity_type: Mapped[AuditEntityType] = mapped_column(
        SqlEnum(AuditEntityType),
        nullable=False,
    )

    entity_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    event: Mapped[AuditEvent] = mapped_column(
        SqlEnum(AuditEvent),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # ======================================================
    # Request Information
    # ======================================================

    ip_address: Mapped[str | None] = mapped_column(
        String(45),
        nullable=True,
    )

    user_agent: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    request_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
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

    user: Mapped["User"] = relationship(
        "User",
        back_populates="audit_logs",
    )

    customer: Mapped["Customer"] = relationship(
        "Customer",
        back_populates="audit_logs",
    )