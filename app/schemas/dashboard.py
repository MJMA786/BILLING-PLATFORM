from datetime import datetime

from pydantic import BaseModel


class DashboardStats(BaseModel):

    customers: int

    plans: int

    subscriptions: int

    revenue: float


class DashboardInvoice(BaseModel):

    id: int

    invoice_number: str

    customer_name: str

    plan_name: str

    amount: float

    status: str

    issued_at: datetime


class DashboardNotification(BaseModel):

    type: str

    title: str

    message: str

    icon: str


class DashboardResponse(BaseModel):

    stats: DashboardStats

    recent_invoices: list[DashboardInvoice]

    notifications: list[DashboardNotification]
# ==========================================
# Dashboard Analytics
# ==========================================

class MonthlyRevenue(BaseModel):

    month: str

    revenue: float


class SubscriptionDistribution(BaseModel):

    name: str

    value: int


class DashboardAnalyticsResponse(BaseModel):

    monthly_revenue: list[MonthlyRevenue]

    subscription_distribution: list[SubscriptionDistribution]