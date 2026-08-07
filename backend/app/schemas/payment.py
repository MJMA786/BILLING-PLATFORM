from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# --------------------------
# Invoice Summary
# --------------------------

class InvoiceSummary(BaseModel):

    id: int

    invoice_number: str

    total: float

    class Config:
        from_attributes = True


# --------------------------
# Customer Payment Response
# --------------------------

class PaymentRead(BaseModel):

    id: int

    invoice: InvoiceSummary

    customer_name: Optional[str] = None

    amount: float

    status: str

    gateway_reference: str

    payment_method: Optional[str] = None

    attempted_at: datetime

    class Config:
        from_attributes = True


# --------------------------
# Create Payment
# --------------------------

class PaymentCreate(BaseModel):

    invoice_id: int

    payment_method: str


# --------------------------
# Retry Payment
# --------------------------

class PaymentRetry(BaseModel):

    payment_method: Optional[str] = None


# --------------------------
# Refund Payment
# --------------------------

class PaymentRefund(BaseModel):

    reason: Optional[str] = None


# --------------------------
# Checkout Request
# --------------------------

class PaymentCheckoutRequest(BaseModel):

    plan_id: Optional[int] = None

    invoice_id: Optional[int] = None

    payment_method: str = "card"