from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from app.models.payment import (
    Payment,
    PaymentStatus,
)
from app.models.subscription import Subscription
from app.models.customer import Customer
from app.models.invoice import Invoice
from app.models.billing_cycle import BillingCycle


class PaymentRepository:

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(Payment)
            .options(
                joinedload(Payment.invoice)
                .joinedload(Invoice.billing_cycle)
                .joinedload(BillingCycle.subscription)
                .joinedload(Subscription.customer)
            )
            .order_by(Payment.attempted_at.desc())
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        payment_id: int,
    ):
        return (
            db.query(Payment)
            .options(
                joinedload(Payment.invoice)
                .joinedload(Invoice.billing_cycle)
                .joinedload(BillingCycle.subscription)
                .joinedload(Subscription.customer)
            )
            .filter(
                Payment.id == payment_id
            )
            .first()
        )

    @staticmethod
    def get_by_invoice(
        db: Session,
        invoice_id: int,
    ):
        return (
            db.query(Payment)
            .filter(
                Payment.invoice_id == invoice_id
            )
            .order_by(
                Payment.attempted_at.desc()
            )
            .all()
        )

    @staticmethod
    def get_by_customer(
        db: Session,
        customer_id: int,
    ):
        return (
            db.query(Payment)
            .options(
                joinedload(Payment.invoice)
            )
            .join(
                Invoice,
                Payment.invoice_id == Invoice.id,
            )
            .outerjoin(
                BillingCycle,
                Invoice.billing_cycle_id == BillingCycle.id,
            )
            .outerjoin(
                Subscription,
                BillingCycle.subscription_id == Subscription.id,
            )
            .filter(
                (Invoice.customer_id == customer_id) | (Subscription.customer_id == customer_id)
            )
            .order_by(
                Payment.attempted_at.desc()
            )
            .all()
        )

    @staticmethod
    def create(
        db: Session,
        payment: Payment,
    ):
        db.add(payment)
        db.commit()
        db.refresh(payment)

        return payment

    @staticmethod
    def update(
        db: Session,
    ):
        db.commit()

    @staticmethod
    def update_status(
        db: Session,
        payment: Payment,
        status: PaymentStatus,
    ):
        payment.status = status

        db.commit()
        db.refresh(payment)

        return payment

    @staticmethod
    def refund(
        db: Session,
        payment: Payment,
    ):
        payment.status = PaymentStatus.REFUNDED

        db.commit()
        db.refresh(payment)

        return payment

    @staticmethod
    def delete(
        db: Session,
        payment: Payment,
    ):
        db.delete(payment)
        db.commit()