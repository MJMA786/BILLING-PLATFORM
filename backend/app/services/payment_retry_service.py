from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.payment import (
    PaymentStatus,
)
from app.models.payment_retry import (
    PaymentRetry,
    RetryOutcome,
)
from app.repositories.payment_repository import (
    PaymentRepository,
)
from app.repositories.payment_retry_repository import (
    PaymentRetryRepository,
)
from app.schemas.payment_retry import (
    PaymentRetryCreate,
    PaymentRetryUpdate,
)


MAX_RETRY_ATTEMPTS = 3


class PaymentRetryService:

    @staticmethod
    def get_all_retries(
        db: Session,
    ):
        return PaymentRetryRepository.get_all(db)

    @staticmethod
    def get_retry_by_id(
        db: Session,
        retry_id: int,
    ):
        retry = PaymentRetryRepository.get_by_id(
            db,
            retry_id,
        )

        if not retry:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment retry not found.",
            )

        return retry

    @staticmethod
    def get_payment_retries(
        db: Session,
        payment_id: int,
    ):
        payment = PaymentRepository.get_by_id(
            db,
            payment_id,
        )

        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found.",
            )

        return PaymentRetryRepository.get_by_payment(
            db,
            payment_id,
        )

    @staticmethod
    def create_retry(
        db: Session,
        retry_data: PaymentRetryCreate,
    ):
        payment = PaymentRepository.get_by_id(
            db,
            retry_data.payment_id,
        )

        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found.",
            )

        retries = PaymentRetryRepository.get_by_payment(
            db,
            payment.id,
        )

        if len(retries) >= MAX_RETRY_ATTEMPTS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Maximum retry attempts reached.",
            )

        retry = PaymentRetry(
            payment_id=payment.id,
            attempt_number=len(retries) + 1,
            scheduled_for=retry_data.scheduled_for,
            outcome=RetryOutcome.PENDING,
        )

        return PaymentRetryRepository.create(
            db,
            retry,
        )

    @staticmethod
    def mark_success(
        db: Session,
        retry_id: int,
    ):
        retry = PaymentRetryRepository.get_by_id(
            db,
            retry_id,
        )

        if not retry:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment retry not found.",
            )

        retry.payment.status = PaymentStatus.SUCCEEDED

        PaymentRepository.update(db)

        return PaymentRetryRepository.update_outcome(
            db,
            retry,
            RetryOutcome.SUCCEEDED,
        )

    @staticmethod
    def mark_failed(
        db: Session,
        retry_id: int,
        retry_data: PaymentRetryUpdate,
    ):
        retry = PaymentRetryRepository.get_by_id(
            db,
            retry_id,
        )

        if not retry:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment retry not found.",
            )

        retry.failure_reason = retry_data.failure_reason

        PaymentRepository.update_status(
            db,
            retry.payment,
            PaymentStatus.FAILED,
        )

        return PaymentRetryRepository.update_outcome(
            db,
            retry,
            RetryOutcome.FAILED,
        )

    @staticmethod
    def delete_retry(
        db: Session,
        retry_id: int,
    ):
        retry = PaymentRetryRepository.get_by_id(
            db,
            retry_id,
        )

        if not retry:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment retry not found.",
            )

        PaymentRetryRepository.delete(
            db,
            retry,
        )

        return {
            "message": "Payment retry deleted successfully."
        }