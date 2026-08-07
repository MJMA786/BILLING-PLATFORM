from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from app.models.payment import Payment
from app.models.payment_retry import (
    PaymentRetry,
    RetryOutcome,
)


class PaymentRetryRepository:

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(PaymentRetry)
            .options(
                joinedload(PaymentRetry.payment)
            )
            .order_by(
                PaymentRetry.scheduled_for.desc()
            )
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        retry_id: int,
    ):
        return (
            db.query(PaymentRetry)
            .options(
                joinedload(PaymentRetry.payment)
            )
            .filter(
                PaymentRetry.id == retry_id
            )
            .first()
        )

    @staticmethod
    def get_by_payment(
        db: Session,
        payment_id: int,
    ):
        return (
            db.query(PaymentRetry)
            .filter(
                PaymentRetry.payment_id == payment_id
            )
            .order_by(
                PaymentRetry.attempt_number.asc()
            )
            .all()
        )

    @staticmethod
    def get_pending(
        db: Session,
    ):
        return (
            db.query(PaymentRetry)
            .filter(
                PaymentRetry.outcome == RetryOutcome.PENDING
            )
            .order_by(
                PaymentRetry.scheduled_for.asc()
            )
            .all()
        )

    @staticmethod
    def create(
        db: Session,
        retry: PaymentRetry,
    ):
        db.add(retry)
        db.commit()
        db.refresh(retry)

        return retry

    @staticmethod
    def update(
        db: Session,
    ):
        db.commit()

    @staticmethod
    def update_outcome(
        db: Session,
        retry: PaymentRetry,
        outcome: RetryOutcome,
    ):
        retry.outcome = outcome

        db.commit()
        db.refresh(retry)

        return retry

    @staticmethod
    def delete(
        db: Session,
        retry: PaymentRetry,
    ):
        db.delete(retry)
        db.commit()