from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from app.models.billing_cycle import BillingCycle
from app.models.subscription import Subscription


class BillingCycleRepository:

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(BillingCycle)
            .options(
                joinedload(BillingCycle.subscription)
            )
            .order_by(BillingCycle.id.desc())
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        billing_cycle_id: int,
    ):
        return (
            db.query(BillingCycle)
            .options(
                joinedload(BillingCycle.subscription)
            )
            .filter(
                BillingCycle.id == billing_cycle_id
            )
            .first()
        )

    @staticmethod
    def get_by_subscription(
        db: Session,
        subscription_id: int,
    ):
        return (
            db.query(BillingCycle)
            .filter(
                BillingCycle.subscription_id == subscription_id
            )
            .order_by(
                BillingCycle.cycle_start.desc()
            )
            .all()
        )

    @staticmethod
    def create(
        db: Session,
        billing_cycle: BillingCycle,
    ):
        db.add(billing_cycle)
        db.commit()
        db.refresh(billing_cycle)

        return billing_cycle

    @staticmethod
    def update(
        db: Session,
    ):
        db.commit()

    @staticmethod
    def delete(
        db: Session,
        billing_cycle: BillingCycle,
    ):
        db.delete(billing_cycle)
        db.commit()