from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.subscription import (
    Subscription,
)

from app.models.plan import Plan

from app.models.billing_cycle import (
    BillingCycle,
)

from app.models.invoice import (
    Invoice,
    InvoiceStatus,
)

from app.models.payment import (
    Payment,
    PaymentStatus,
)


class CustomerDashboardRepository:

    # ==========================================
    # Current Subscription
    # ==========================================

    @staticmethod
    def get_subscription(
        db: Session,
        customer_id: int,
    ):

        return (

            db.query(
                Subscription,
                Plan,
            )

            .join(
                Plan,
                Subscription.plan_id == Plan.id,
            )

            .filter(
                Subscription.customer_id == customer_id
            )

            .first()

        )

    # ==========================================
    # Invoice Count
    # ==========================================

    @staticmethod
    def get_invoice_count(
        db: Session,
        customer_id: int,
    ):

        return (

            db.query(
                func.count(Invoice.id)
            )

            .join(
                BillingCycle,
                Invoice.billing_cycle_id == BillingCycle.id,
            )

            .join(
                Subscription,
                BillingCycle.subscription_id == Subscription.id,
            )

            .filter(
                Subscription.customer_id == customer_id
            )

            .scalar()

            or 0

        )

    # ==========================================
    # Pending Amount
    # ==========================================

    @staticmethod
    def get_pending_amount(
        db: Session,
        customer_id: int,
    ):

        total = (

            db.query(
                func.sum(
                    Invoice.total
                )
            )

            .join(
                BillingCycle,
                Invoice.billing_cycle_id == BillingCycle.id,
            )

            .join(
                Subscription,
                BillingCycle.subscription_id == Subscription.id,
            )

            .filter(

                Subscription.customer_id == customer_id,

                Invoice.status == InvoiceStatus.OPEN,

            )

            .scalar()

        )

        return float(total or 0)

    # ==========================================
    # Successful Payments
    # ==========================================

    @staticmethod
    def get_total_paid(
        db: Session,
        customer_id: int,
    ):

        total = (

            db.query(
                func.sum(
                    Payment.amount
                )
            )

            .join(
                Invoice,
                Payment.invoice_id == Invoice.id,
            )

            .join(
                BillingCycle,
                Invoice.billing_cycle_id == BillingCycle.id,
            )

            .join(
                Subscription,
                BillingCycle.subscription_id == Subscription.id,
            )

            .filter(

                Subscription.customer_id == customer_id,

                Payment.status == PaymentStatus.SUCCEEDED,

            )

            .scalar()

        )

        return float(total or 0)

    # ==========================================
    # Recent Invoices
    # ==========================================

    @staticmethod
    def get_recent_invoices(
        db: Session,
        customer_id: int,
        limit: int = 5,
    ):

        invoices = (

            db.query(
                Invoice
            )

            .join(
                BillingCycle,
                Invoice.billing_cycle_id == BillingCycle.id,
            )

            .join(
                Subscription,
                BillingCycle.subscription_id == Subscription.id,
            )

            .filter(
                Subscription.customer_id == customer_id
            )

            .order_by(
                Invoice.issued_at.desc()
            )

            .limit(limit)

            .all()

        )

        return invoices

    # ==========================================
    # Recent Payments
    # ==========================================

    @staticmethod
    def get_recent_payments(
        db: Session,
        customer_id: int,
        limit: int = 5,
    ):

        payments = (

            db.query(
                Payment
            )

            .join(
                Invoice,
                Payment.invoice_id == Invoice.id,
            )

            .join(
                BillingCycle,
                Invoice.billing_cycle_id == BillingCycle.id,
            )

            .join(
                Subscription,
                BillingCycle.subscription_id == Subscription.id,
            )

            .filter(
                Subscription.customer_id == customer_id
            )

            .order_by(
                Payment.attempted_at.desc()
            )

            .limit(limit)

            .all()

        )

        return payments