from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# --------------------------
# Subscription Summary
# --------------------------

class SubscriptionSummary(BaseModel):

    id: int

    class Config:
        from_attributes = True


# --------------------------
# Create Billing Cycle
# --------------------------

class BillingCycleCreate(BaseModel):

    subscription_id: int

    cycle_start: datetime

    cycle_end: datetime


# --------------------------
# Update Billing Cycle
# --------------------------

class BillingCycleUpdate(BaseModel):

    status: Optional[str] = None

    cycle_end: Optional[datetime] = None


# --------------------------
# Response
# --------------------------

class BillingCycleRead(BaseModel):

    id: int

    subscription: SubscriptionSummary

    cycle_start: datetime

    cycle_end: datetime

    status: str

    created_at: datetime

    class Config:
        from_attributes = True