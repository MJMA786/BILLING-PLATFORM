from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# --------------------------
# Payment Summary
# --------------------------

class PaymentSummary(BaseModel):

    id: int

    class Config:
        from_attributes = True


# --------------------------
# Create Retry
# --------------------------

class PaymentRetryCreate(BaseModel):

    payment_id: int

    scheduled_for: datetime


# --------------------------
# Update Retry
# --------------------------

class PaymentRetryUpdate(BaseModel):

    outcome: Optional[str] = None

    failure_reason: Optional[str] = None


# --------------------------
# Response
# --------------------------

class PaymentRetryRead(BaseModel):

    id: int

    payment: PaymentSummary

    attempt_number: int

    scheduled_for: datetime

    outcome: str

    failure_reason: Optional[str]

    class Config:
        from_attributes = True