from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.core.enums import Currency


class SystemSettingsBase(BaseModel):
    company_name: str = "Subly Platform"
    company_email: str = "support@subly.com"
    company_phone: Optional[str] = "+1 (800) 555-0199"
    company_address: Optional[str] = "100 Innovation Way, Suite 400, San Francisco, CA 94105"
    company_logo: Optional[str] = None

    invoice_prefix: str = "INV"
    next_invoice_number: int = 1001

    default_currency: Currency = Currency.USD
    default_tax_percentage: float = 18.0

    timezone: str = "UTC"
    date_format: str = "DD/MM/YYYY"

    support_email: Optional[str] = "support@subly.com"
    support_phone: Optional[str] = "+1 (800) 555-0199"

    email_notifications_enabled: bool = True
    maintenance_mode: bool = False
    allow_new_registrations: bool = True

    smtp_sender_name: str = "Subly Platform"
    smtp_sender_email: str = "noreply@subly.com"


class SystemSettingsUpdate(BaseModel):
    company_name: Optional[str] = None
    company_email: Optional[str] = None
    company_phone: Optional[str] = None
    company_address: Optional[str] = None
    company_logo: Optional[str] = None

    invoice_prefix: Optional[str] = None
    next_invoice_number: Optional[int] = None

    default_currency: Optional[Currency] = None
    default_tax_percentage: Optional[float] = None

    timezone: Optional[str] = None
    date_format: Optional[str] = None

    support_email: Optional[str] = None
    support_phone: Optional[str] = None

    email_notifications_enabled: Optional[bool] = None
    maintenance_mode: Optional[bool] = None
    allow_new_registrations: Optional[bool] = None

    smtp_sender_name: Optional[str] = None
    smtp_sender_email: Optional[str] = None


class SystemSettingsRead(SystemSettingsBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
