from sqlalchemy.orm import Session

from app.models.user import User

from app.repositories.customer_repository import (
    CustomerRepository,
)

from app.repositories.customer_dashboard_repository import (
    CustomerDashboardRepository,
)


class CustomerDashboardService:

    @staticmethod
    def get_dashboard(
        db: Session,
        current_user: User,
    ):

        # ==========================================
        # Get Logged-in Customer
        # ==========================================

        customer = CustomerRepository.get_by_user_id(
            db,
            current_user.id,
        )

        if not customer:

            return {

                "message": "Customer not found."

            }

        # ==========================================
        # Subscription
        # ==========================================

        subscription_data = (
            CustomerDashboardRepository.get_subscription(
                db,
                customer.id,
            )
        )

        plan = None

        subscription = None

        if subscription_data:

            subscription, plan = subscription_data

        # ==========================================
        # Statistics
        # ==========================================

        invoice_count = (
            CustomerDashboardRepository.get_invoice_count(
                db,
                customer.id,
            )
        )

        pending_amount = (
            CustomerDashboardRepository.get_pending_amount(
                db,
                customer.id,
            )
        )

        total_paid = (
            CustomerDashboardRepository.get_total_paid(
                db,
                customer.id,
            )
        )

        # ==========================================
        # Recent Activity
        # ==========================================

        recent_invoices = (
            CustomerDashboardRepository.get_recent_invoices(
                db,
                customer.id,
            )
        )

        recent_payments = (
            CustomerDashboardRepository.get_recent_payments(
                db,
                customer.id,
            )
        )

        # ==========================================
        # Response
        # ==========================================

        return {

            "plan": {

                "name": (
                    plan.name
                    if plan
                    else None
                ),

                "price": (
                    float(plan.price)
                    if plan
                    else 0
                ),

                "billing_interval": (
                    plan.billing_interval.value
                    if plan
                    else None
                ),

            },

            "subscription": {

                "status": (
                    subscription.status.value
                    if subscription
                    else None
                ),

                "renewal_date": (
                    subscription.current_period_end
                    if subscription
                    else None
                ),

                "trial_end": (
                    subscription.trial_ends_at
                    if subscription
                    else None
                ),

            },

            "invoice_count": invoice_count,

            "pending_amount": pending_amount,

            "total_paid": total_paid,

            "recent_invoices": [

                {

                    "id": invoice.id,

                    "invoice_number": invoice.invoice_number,

                    "amount": float(invoice.total),

                    "status": invoice.status.value,

                    "issued_at": invoice.issued_at,

                }

                for invoice in recent_invoices

            ],

            "recent_payments": [

                {

                    "id": payment.id,

                    "amount": float(payment.amount),

                    "status": payment.status.value,

                    "gateway_reference": payment.gateway_reference,

                    "attempted_at": payment.attempted_at,

                }

                for payment in recent_payments

            ],

        }