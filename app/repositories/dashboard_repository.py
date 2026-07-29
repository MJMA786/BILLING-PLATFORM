from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.billing_cycle import BillingCycle
from app.models.customer import Customer
from app.models.invoice import Invoice, InvoiceStatus
from app.models.payment import Payment, PaymentStatus
from app.models.plan import Plan
from app.models.subscription import (
    Subscription,
    SubscriptionStatus,
)


class DashboardRepository:

    # ==========================================
    # Dashboard Statistics
    # ==========================================

    @staticmethod
    def get_customer_count(
        db: Session,
    ) -> int:

        return (
            db.query(func.count(Customer.id))
            .scalar()
            or 0
        )

    @staticmethod
    def get_plan_count(
        db: Session,
    ) -> int:

        return (
            db.query(func.count(Plan.id))
            .filter(
                Plan.active.is_(True)
            )
            .scalar()
            or 0
        )

    @staticmethod
    def get_active_subscription_count(
        db: Session,
    ) -> int:

        return (
            db.query(func.count(Subscription.id))
            .filter(
                Subscription.status
                == SubscriptionStatus.ACTIVE
            )
            .scalar()
            or 0
        )

    @staticmethod
    def get_total_revenue(
        db: Session,
    ):

        revenue = (
            db.query(
                func.sum(
                    Payment.amount
                )
            )
            .filter(
                Payment.status
                == PaymentStatus.SUCCEEDED
            )
            .scalar()
        )

        return float(revenue or 0)
        # ==========================================
    # Recent Invoices
    # ==========================================

    @staticmethod
    def get_recent_invoices(
        db: Session,
        limit: int = 5,
    ):

        invoices = (

            db.query(

                Invoice,

                Customer.name.label("customer_name"),

                Plan.name.label("plan_name"),

            )

            .join(
                BillingCycle,
                Invoice.billing_cycle_id == BillingCycle.id,
            )

            .join(
                Subscription,
                BillingCycle.subscription_id == Subscription.id,
            )

            .join(
                Customer,
                Subscription.customer_id == Customer.id,
            )

            .join(
                Plan,
                Subscription.plan_id == Plan.id,
            )

            .order_by(
                Invoice.issued_at.desc()
            )

            .limit(limit)

            .all()

        )

        results = []

        for invoice, customer_name, plan_name in invoices:

            results.append({

                "id": invoice.id,

                "invoice_number": invoice.invoice_number,

                "customer_name": customer_name,

                "plan_name": plan_name,

                "amount": float(invoice.total),

                "status": invoice.status.value,

                "issued_at": invoice.issued_at,

            })

        return results
        # ==========================================
    # Dashboard Notifications
    # ==========================================

    @staticmethod
    def get_due_today_count(
        db: Session,
    ) -> int:

        return (

            db.query(
                func.count(
                    Invoice.id
                )
            )

            .filter(

                Invoice.status == InvoiceStatus.OPEN,

                func.date(
                    Invoice.due_at
                ) == date.today(),

            )

            .scalar()

            or 0

        )

    @staticmethod
    def get_failed_payment_count(
        db: Session,
    ) -> int:

        return (

            db.query(
                func.count(
                    Payment.id
                )
            )

            .filter(

                Payment.status
                == PaymentStatus.FAILED

            )

            .scalar()

            or 0

        )

    @staticmethod
    def get_new_customer_count(
        db: Session,
    ) -> int:

        return (

            db.query(
                func.count(
                    Customer.id
                )
            )

            .filter(

                func.date(
                    Customer.created_at
                ) == date.today()

            )

            .scalar()

            or 0

        )

    @staticmethod
    def get_trial_subscription_count(
        db: Session,
    ) -> int:

        return (

            db.query(
                func.count(
                    Subscription.id
                )
            )

            .filter(

                Subscription.status
                == SubscriptionStatus.TRIAL

            )

            .scalar()

            or 0

        )