from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.customer import Currency


# ==========================================================
# Create Customer
# ==========================================================

class CustomerCreate(BaseModel):
    company_name: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    contact_person: Optional[str] = None

    billing_email: EmailStr

    phone: Optional[str] = None

    address_line1: Optional[str] = None

    address_line2: Optional[str] = None

    city: Optional[str] = None

    state: Optional[str] = None

    postal_code: Optional[str] = None

    country: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    tax_id: Optional[str] = None

    currency: Currency = Currency.USD

    timezone: str = "UTC"


# ==========================================================
# Update Customer
# ==========================================================

class CustomerUpdate(BaseModel):
    company_name: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    contact_person: Optional[str] = None

    billing_email: EmailStr

    phone: Optional[str] = None

    address_line1: Optional[str] = None

    address_line2: Optional[str] = None

    city: Optional[str] = None

    state: Optional[str] = None

    postal_code: Optional[str] = None

    country: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    tax_id: Optional[str] = None

    currency: Currency = Currency.USD

    timezone: str = "UTC"

    is_active: bool = True


# ==========================================================
# Customer Response
# ==========================================================

class CustomerResponse(BaseModel):
    id: int

    user_id: int | None

    company_name: str

    contact_person: str | None

    billing_email: EmailStr

    phone: str | None

    address_line1: str | None

    address_line2: str | None

    city: str | None

    state: str | None

    postal_code: str | None

    country: str

    tax_id: str | None

    currency: Currency

    timezone: str

    is_active: bool

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )