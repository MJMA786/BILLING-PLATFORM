from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.plan import (
    BillingInterval,
    Currency,
)


# ==========================================================
# Base Schema
# ==========================================================

class PlanBase(BaseModel):

    name: str = Field(
        ...,
        min_length=3,
        max_length=100,
    )

    description: str = Field(
        ...,
        min_length=5,
    )

    price: float = Field(
        ...,
        gt=0,
    )

    currency: Currency

    billing_interval: BillingInterval

    trial_days: int = Field(
        default=14,
        ge=0,
    )

    features: dict = Field(
        default_factory=dict,
    )

    is_active: bool = True


# ==========================================================
# Create
# ==========================================================

class PlanCreate(PlanBase):
    pass


# ==========================================================
# Update
# ==========================================================

class PlanUpdate(BaseModel):

    name: Optional[str] = Field(
        default=None,
        min_length=3,
        max_length=100,
    )

    description: Optional[str] = Field(
        default=None,
        min_length=5,
    )

    price: Optional[float] = Field(
        default=None,
        gt=0,
    )

    currency: Optional[Currency] = None

    billing_interval: Optional[BillingInterval] = None

    trial_days: Optional[int] = None

    features: Optional[dict] = None

    is_active: Optional[bool] = None


# ==========================================================
# Read
# ==========================================================

class PlanRead(PlanBase):

    id: int

    slug: str

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )