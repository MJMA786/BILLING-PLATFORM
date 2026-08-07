from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# --------------------------
# Customer Summary
# --------------------------

class CustomerSummary(BaseModel):
    id: int
    company_name: str
    contact_person: str
    billing_email: str

    class Config:
        from_attributes = True


# --------------------------
# Plan Summary
# --------------------------

class PlanSummary(BaseModel):
    id: int
    name: str
    price: float
    billing_interval: str

    class Config:
        from_attributes = True


# --------------------------
# Create Subscription
# --------------------------

class SubscriptionCreate(BaseModel):
    plan_id: int
    customer_id: Optional[int] = None

# --------------------------
# Update Plan
# --------------------------

class SubscriptionUpdate(BaseModel):
    plan_id: int


# --------------------------
# Response
# --------------------------

class SubscriptionResponse(BaseModel):

    id: int

    status: str

    customer: CustomerSummary

    plan: PlanSummary

    trial_ends_at: Optional[datetime]

    current_period_start: Optional[datetime]

    current_period_end: Optional[datetime]

    cancel_at_period_end: bool

    created_at: datetime

    class Config:
        from_attributes = True


# --------------------------
# Upgrade
# --------------------------

class SubscriptionUpgrade(BaseModel):
    new_plan_id: int


# --------------------------
# Downgrade
# --------------------------

class SubscriptionDowngrade(BaseModel):
    new_plan_id: int


# --------------------------
# Cancel
# --------------------------

class SubscriptionCancel(BaseModel):
    cancel_at_period_end: bool = True