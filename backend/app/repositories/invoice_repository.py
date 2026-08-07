from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from app.models.invoice import (
    Invoice,
    InvoiceStatus,
)
from app.models.billing_cycle import BillingCycle
from app.models.subscription import Subscription


class InvoiceRepository:

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(Invoice)
            .options(
                joinedload(Invoice.billing_cycle)
                .joinedload(BillingCycle.subscription)
                .joinedload(Subscription.customer),
                joinedload(Invoice.billing_cycle)
                .joinedload(BillingCycle.subscription)
                .joinedload(Subscription.plan),
            )
            .order_by(Invoice.issued_at.desc())
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        invoice_id: int,
    ):
        return (
            db.query(Invoice)
            .options(
                joinedload(Invoice.billing_cycle)
                .joinedload(BillingCycle.subscription)
                .joinedload(Subscription.customer),
                joinedload(Invoice.billing_cycle)
                .joinedload(BillingCycle.subscription)
                .joinedload(Subscription.plan),
            )
            .filter(
                Invoice.id == invoice_id
            )
            .first()
        )

    @staticmethod
    def get_by_number(
        db: Session,
        invoice_number: str,
    ):
        return (
            db.query(Invoice)
            .filter(
                Invoice.invoice_number == invoice_number
            )
            .first()
        )

    @staticmethod
    def get_by_billing_cycle(
        db: Session,
        billing_cycle_id: int,
    ):
        return (
            db.query(Invoice)
            .filter(
                Invoice.billing_cycle_id == billing_cycle_id
            )
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        invoice: Invoice,
    ):
        db.add(invoice)
        db.commit()
        db.refresh(invoice)

        return invoice

    @staticmethod
    def update(
        db: Session,
    ):
        db.commit()

    @staticmethod
    def update_status(
        db: Session,
        invoice: Invoice,
        status: InvoiceStatus,
    ):
        invoice.status = status

        db.commit()
        db.refresh(invoice)

        return invoice

    @staticmethod
    def delete(
        db: Session,
        invoice: Invoice,
    ):
        db.delete(invoice)
        db.commit()