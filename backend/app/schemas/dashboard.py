from datetime import datetime

from pydantic import BaseModel


# ==========================================================
# Dashboard Statistics
# ==========================================================

class DashboardStats(BaseModel):
    customers: int
    active_customers: int

    plans: int
    active_plans: int

    subscriptions: int
    active_subscriptions: int

    revenue: float
    annual_revenue: float

    outstanding_amount: float

    total_invoices: int
    paid_invoices: int
    pending_invoices: int

    failed_payments: int
    successful_payments: int


# ==========================================================
# Recent Customers
# ==========================================================

class DashboardCustomer(BaseModel):
    id: int
    company_name: str
    billing_email: str
    country: str
    created_at: datetime


# ==========================================================
# Recent Invoices
# ==========================================================

class DashboardInvoice(BaseModel):
    id: int
    invoice_number: str
    customer_name: str
    plan_name: str
    amount: float
    status: str
    issued_at: datetime


# ==========================================================
# Recent Payments
# ==========================================================

class DashboardPayment(BaseModel):
    id: int
    customer_name: str
    amount: float
    status: str
    attempted_at: datetime


# ==========================================================
# Notifications
# ==========================================================

class DashboardNotification(BaseModel):
    type: str
    title: str
    message: str
    icon: str


# ==========================================================
# System Health
# ==========================================================

class SystemHealth(BaseModel):
    database: str
    api: str
    billing: str
    notifications: str


# ==========================================================
# Dashboard Response
# ==========================================================

class DashboardResponse(BaseModel):
    stats: DashboardStats

    recent_customers: list[DashboardCustomer]

    recent_invoices: list[DashboardInvoice]

    recent_payments: list[DashboardPayment]

    notifications: list[DashboardNotification]

    system_health: SystemHealth


# ==========================================================
# Dashboard Analytics
# ==========================================================

class MonthlyRevenue(BaseModel):
    month: str
    revenue: float


class SubscriptionDistribution(BaseModel):
    name: str
    value: int


class DashboardAnalyticsResponse(BaseModel):
    monthly_revenue: list[MonthlyRevenue]
    subscription_distribution: list[SubscriptionDistribution]