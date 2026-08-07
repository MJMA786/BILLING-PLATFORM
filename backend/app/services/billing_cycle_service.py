from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.billing_cycle import (
    BillingCycle,
    BillingCycleStatus,
)
from app.repositories.billing_cycle_repository import (
    BillingCycleRepository,
)
from app.repositories.subscription_repository import (
    SubscriptionRepository,
)
from app.schemas.billing_cycle import (
    BillingCycleCreate,
    BillingCycleUpdate,
)


class BillingCycleService:

    @staticmethod
    def get_all_billing_cycles(
        db: Session,
    ):
        return BillingCycleRepository.get_all(db)

    @staticmethod
    def get_billing_cycle_by_id(
        db: Session,
        billing_cycle_id: int,
    ):
        billing_cycle = BillingCycleRepository.get_by_id(
            db,
            billing_cycle_id,
        )

        if not billing_cycle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Billing cycle not found.",
            )

        return billing_cycle

    @staticmethod
    def get_subscription_cycles(
        db: Session,
        subscription_id: int,
    ):
        subscription = SubscriptionRepository.get_by_id(
            db,
            subscription_id,
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscription not found.",
            )

        return BillingCycleRepository.get_by_subscription(
            db,
            subscription_id,
        )

    @staticmethod
    def create_billing_cycle(
        db: Session,
        billing_cycle_data: BillingCycleCreate,
    ):
        subscription = SubscriptionRepository.get_by_id(
            db,
            billing_cycle_data.subscription_id,
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscription not found.",
            )

        billing_cycle = BillingCycle(
            subscription_id=billing_cycle_data.subscription_id,
            cycle_start=billing_cycle_data.cycle_start,
            cycle_end=billing_cycle_data.cycle_end,
            status=BillingCycleStatus.PENDING,
        )

        return BillingCycleRepository.create(
            db,
            billing_cycle,
        )

    @staticmethod
    def update_billing_cycle(
        db: Session,
        billing_cycle_id: int,
        billing_cycle_data: BillingCycleUpdate,
    ):
        billing_cycle = BillingCycleRepository.get_by_id(
            db,
            billing_cycle_id,
        )

        if not billing_cycle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Billing cycle not found.",
            )

        update_data = billing_cycle_data.model_dump(
            exclude_unset=True,
        )

        for key, value in update_data.items():
            setattr(
                billing_cycle,
                key,
                value,
            )

        BillingCycleRepository.update(db)

        return billing_cycle

    @staticmethod
    def delete_billing_cycle(
        db: Session,
        billing_cycle_id: int,
    ):
        billing_cycle = BillingCycleRepository.get_by_id(
            db,
            billing_cycle_id,
        )

        if not billing_cycle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Billing cycle not found.",
            )

        BillingCycleRepository.delete(
            db,
            billing_cycle,
        )

        return {
            "message": "Billing cycle deleted successfully."
        }