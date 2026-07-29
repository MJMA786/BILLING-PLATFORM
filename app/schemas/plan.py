from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.plan import BillingInterval


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

    currency: str = Field(
        ...,
        min_length=3,
        max_length=10,
    )

    interval: BillingInterval

    active: bool = True


class PlanCreate(PlanBase):
    pass


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

    currency: Optional[str] = Field(
        default=None,
        min_length=3,
        max_length=10,
    )

    interval: Optional[BillingInterval] = None

    active: Optional[bool] = None


class PlanRead(PlanBase):
    id: int

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )