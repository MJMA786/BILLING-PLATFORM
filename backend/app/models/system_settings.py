from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum as SqlEnum,
    Integer,
    Numeric,
    String,
    func,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from app.database.base import Base
from app.core.enums import Currency


# ==========================================================
# System Settings Model
# ==========================================================

class SystemSettings(Base):
    __tablename__ = "system_settings"

    # ======================================================
    # Primary Key
    # ======================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    # ======================================================
    # Company Information
    # ======================================================

    company_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    company_email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    company_phone: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    company_address: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    company_logo: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    # ======================================================
    # Invoice Settings
    # ======================================================

    invoice_prefix: Mapped[str] = mapped_column(
        String(20),
        default="INV",
        nullable=False,
    )

    next_invoice_number: Mapped[int] = mapped_column(
        Integer,
        default=1001,
        nullable=False,
    )

    # ======================================================
    # Financial Settings
    # ======================================================

    default_currency: Mapped[Currency] = mapped_column(
        SqlEnum(Currency),
        default=Currency.USD,
        nullable=False,
    )

    default_tax_percentage: Mapped[float] = mapped_column(
        Numeric(5, 2),
        default=0.00,
        nullable=False,
    )

    # ======================================================
    # Localization
    # ======================================================

    timezone: Mapped[str] = mapped_column(
        String(100),
        default="UTC",
        nullable=False,
    )

    date_format: Mapped[str] = mapped_column(
        String(50),
        default="DD/MM/YYYY",
        nullable=False,
    )

    # ======================================================
    # Support
    # ======================================================

    support_email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    support_phone: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    # ======================================================
    # Feature Toggles
    # ======================================================

    email_notifications_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    maintenance_mode: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    allow_new_registrations: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # ======================================================
    # SMTP Display Settings
    # ======================================================

    smtp_sender_name: Mapped[str] = mapped_column(
        String(150),
        default="Subly",
        nullable=False,
    )

    smtp_sender_email: Mapped[str] = mapped_column(
        String(255),
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