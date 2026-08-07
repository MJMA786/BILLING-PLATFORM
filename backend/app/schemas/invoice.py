from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# --------------------------
# Billing Cycle Summary
# --------------------------

class BillingCycleSummary(BaseModel):

    id: int

    class Config:
        from_attributes = True


# --------------------------
# Create Invoice
# --------------------------

class InvoiceCreate(BaseModel):

    billing_cycle_id: int

    subtotal: float

    tax_amount: float

    due_date: datetime


# --------------------------
# Update Invoice
# --------------------------

class InvoiceUpdate(BaseModel):

    subtotal: Optional[float] = None

    tax_amount: Optional[float] = None

    due_date: Optional[datetime] = None

    status: Optional[str] = None


# --------------------------
# Response
# --------------------------

class InvoiceRead(BaseModel):

    id: int

    invoice_number: str

    billing_cycle: BillingCycleSummary

    customer_name: Optional[str] = None

    plan_name: Optional[str] = None

    subtotal: float

    tax_amount: float

    total: float

    status: str

    issued_at: datetime

    due_date: datetime

    class Config:
        from_attributes = True