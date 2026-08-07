from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# ==========================================
# Plan
# ==========================================

class CustomerPlan(BaseModel):

    name: Optional[str]

    price: float

    billing_interval: Optional[str]


# ==========================================
# Subscription
# ==========================================

class CustomerSubscription(BaseModel):

    status: Optional[str]

    renewal_date: Optional[datetime]

    trial_end: Optional[datetime]


# ==========================================
# Recent Invoice
# ==========================================

class CustomerInvoice(BaseModel):

    id: int

    invoice_number: str

    amount: float

    status: str

    issued_at: datetime


# ==========================================
# Recent Payment
# ==========================================

class CustomerPayment(BaseModel):

    id: int

    amount: float

    status: str

    gateway_reference: Optional[str]

    attempted_at: datetime


# ==========================================
# Dashboard Response
# ==========================================

class CustomerDashboardResponse(BaseModel):

    plan: CustomerPlan

    subscription: CustomerSubscription

    invoice_count: int

    pending_amount: float

    total_paid: float

    recent_invoices: list[CustomerInvoice]

    recent_payments: list[CustomerPayment]