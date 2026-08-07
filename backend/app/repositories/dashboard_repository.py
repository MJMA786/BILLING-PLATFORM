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
    def get_customer_count(db: Session) -> int:
        return db.query(func.count(Customer.id)).scalar() or 0

    # ==========================================
    # Active Customers
    # ==========================================

    @staticmethod
    def get_active_customer_count(
        db: Session,
    ) -> int:

        return (

            db.query(
                func.count(
                    func.distinct(Customer.id)
                )
            )

            .join(
                Subscription,
                Subscription.customer_id == Customer.id,
            )

            .filter(
                Subscription.status == SubscriptionStatus.ACTIVE
            )

            .scalar()

            or 0

        )

    @staticmethod
    def get_plan_count(db: Session) -> int:
        return db.query(func.count(Plan.id)).scalar() or 0

    @staticmethod
    def get_active_plan_count(db: Session) -> int:
        return db.query(func.count(Plan.id)).filter(Plan.is_active.is_(True)).scalar() or 0

    @staticmethod
    def get_total_subscription_count(db: Session) -> int:
        return db.query(func.count(Subscription.id)).scalar() or 0

    @staticmethod
    def get_active_subscription_count(db: Session) -> int:
        return db.query(func.count(Subscription.id)).filter(Subscription.status == SubscriptionStatus.ACTIVE).scalar() or 0

    @staticmethod
    def get_total_revenue(db: Session) -> float:
        revenue = db.query(func.sum(Payment.amount)).filter(Payment.status == PaymentStatus.SUCCEEDED).scalar()
        return float(revenue or 0)

    @staticmethod
    def get_outstanding_amount(db: Session) -> float:
        amount = db.query(func.sum(Invoice.total)).filter(Invoice.status != InvoiceStatus.PAID, Invoice.status != InvoiceStatus.VOID).scalar()
        return float(amount or 0)

    @staticmethod
    def get_invoice_counts(db: Session):
        total = db.query(func.count(Invoice.id)).scalar() or 0
        paid = db.query(func.count(Invoice.id)).filter(Invoice.status == InvoiceStatus.PAID).scalar() or 0
        pending = db.query(func.count(Invoice.id)).filter(Invoice.status != InvoiceStatus.PAID, Invoice.status != InvoiceStatus.VOID).scalar() or 0
        return total, paid, pending

    @staticmethod
    def get_payment_counts(db: Session):
        succeeded = db.query(func.count(Payment.id)).filter(Payment.status == PaymentStatus.SUCCEEDED).scalar() or 0
        failed = db.query(func.count(Payment.id)).filter(Payment.status == PaymentStatus.FAILED).scalar() or 0
        return succeeded, failed
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

                Customer.company_name.label("customer_name"),

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
    # Recent Customers
    # ==========================================

    @staticmethod
    def get_recent_customers(
        db: Session,
        limit: int = 5,
    ):

        customers = (

            db.query(Customer)

            .order_by(
                Customer.created_at.desc()
            )

            .limit(limit)

            .all()

        )

        return [

            {

                "id": customer.id,

                "company_name": customer.company_name,

                "billing_email": customer.billing_email,

                "country": customer.country,

                "created_at": customer.created_at,

            }

            for customer in customers

        ]



    # ==========================================
    # Recent Payments
    # ==========================================

    @staticmethod
    def get_recent_payments(
        db: Session,
        limit: int = 5,
    ):

        payments = (

            db.query(

                Payment,

                Customer.company_name.label(
                    "customer_name"
                ),

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

            .join(
                Customer,
                Subscription.customer_id == Customer.id,
            )

            .order_by(
                Payment.attempted_at.desc()
            )

            .limit(limit)

            .all()

        )

        return [

            {

                "id": payment.id,

                "customer_name": customer_name,

                "amount": float(payment.amount),

                "status": payment.status.value,

                "attempted_at": payment.attempted_at,

            }

            for payment, customer_name in payments

        ]
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
                    Invoice.due_date
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
        # ==========================================
    # Dashboard Analytics
    # ==========================================

    @staticmethod
    def get_monthly_revenue(
        db: Session,
    ):

        monthly_data = []

        for month in range(1, 13):

            revenue = (

                db.query(
                    func.sum(Payment.amount)
                )

                .filter(

                    Payment.status == PaymentStatus.SUCCEEDED,

                    func.extract(
                        "month",
                        Payment.attempted_at,
                    ) == month,

                )

                .scalar()

            )

            monthly_data.append({

                "month": [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ][month - 1],

                "revenue": float(revenue or 0),

            })

        return monthly_data

    @staticmethod
    def get_subscription_distribution(
        db: Session,
    ):

        return [

            {

                "name": "Active",

                "value": (

                    db.query(
                        func.count(
                            Subscription.id
                        )
                    )

                    .filter(
                        Subscription.status
                        == SubscriptionStatus.ACTIVE
                    )

                    .scalar()

                    or 0

                ),

            },

            {

                "name": "Trial",

                "value": (

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

                ),

            },

            {

                "name": "Past Due",

                "value": (

                    db.query(
                        func.count(
                            Subscription.id
                        )
                    )

                    .filter(
                        Subscription.status
                        == SubscriptionStatus.PAST_DUE
                    )

                    .scalar()

                    or 0

                ),

            },

            {

                "name": "Cancelled",

                "value": (

                    db.query(
                        func.count(
                            Subscription.id
                        )
                    )

                    .filter(
                        Subscription.status
                        == SubscriptionStatus.CANCELLED
                    )

                    .scalar()

                    or 0

                ),

            },

        ]