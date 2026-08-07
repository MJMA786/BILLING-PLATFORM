from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from app.models.subscription import (
    Subscription,
    SubscriptionStatus,
)


class SubscriptionRepository:

    # ======================================================
    # Get All
    # ======================================================

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(Subscription)
            .options(
                joinedload(Subscription.customer),
                joinedload(Subscription.plan),
            )
            .order_by(Subscription.id)
            .all()
        )

    # ======================================================
    # Get By ID
    # ======================================================

    @staticmethod
    def get_by_id(
        db: Session,
        subscription_id: int,
    ):
        return (
            db.query(Subscription)
            .options(
                joinedload(Subscription.customer),
                joinedload(Subscription.plan),
            )
            .filter(
                Subscription.id == subscription_id
            )
            .first()
        )

    # ======================================================
    # Get By Customer
    # ======================================================

    @staticmethod
    def get_by_customer(
        db: Session,
        customer_id: int,
    ):
        return (
            db.query(Subscription)
            .options(
                joinedload(Subscription.customer),
                joinedload(Subscription.plan),
            )
            .filter(
                Subscription.customer_id == customer_id
            )
            .order_by(
                Subscription.created_at.desc()
            )
            .all()
        )

    # ======================================================
    # Active Subscription
    # ======================================================

    @staticmethod
    def get_active_by_customer(
        db: Session,
        customer_id: int,
    ):
        return (
            db.query(Subscription)
            .options(
                joinedload(Subscription.customer),
                joinedload(Subscription.plan),
            )
            .filter(
                Subscription.customer_id == customer_id,
                Subscription.status.in_(
                    [
                        SubscriptionStatus.ACTIVE,
                        SubscriptionStatus.TRIAL,
                    ]
                ),
            )
            .first()
        )

    # ======================================================
    # Customer Portal
    # ======================================================

    @staticmethod
    def get_my_subscription(
        db: Session,
        customer_id: int,
    ):
        return (
            db.query(Subscription)
            .options(
                joinedload(Subscription.customer),
                joinedload(Subscription.plan),
            )
            .filter(
                Subscription.customer_id == customer_id,
                Subscription.status.in_(
                    [
                        SubscriptionStatus.ACTIVE,
                        SubscriptionStatus.TRIAL,
                    ]
                ),
            )
            .first()
        )

    # ======================================================
    # Get By Status
    # ======================================================

    @staticmethod
    def get_by_status(
        db: Session,
        status: SubscriptionStatus,
    ):
        return (
            db.query(Subscription)
            .options(
                joinedload(Subscription.customer),
                joinedload(Subscription.plan),
            )
            .filter(
                Subscription.status == status
            )
            .all()
        )

    # ======================================================
    # Count
    # ======================================================

    @staticmethod
    def count_active(
        db: Session,
    ):
        return (
            db.query(Subscription)
            .filter(
                Subscription.status == SubscriptionStatus.ACTIVE
            )
            .count()
        )

    # ======================================================
    # Create
    # ======================================================

    @staticmethod
    def create(
        db: Session,
        subscription: Subscription,
    ):
        db.add(subscription)
        db.commit()
        db.refresh(subscription)

        return (
            db.query(Subscription)
            .options(
                joinedload(Subscription.customer),
                joinedload(Subscription.plan),
            )
            .filter(
                Subscription.id == subscription.id
            )
            .first()
        )

    # ======================================================
    # Update
    # ======================================================

    @staticmethod
    def update(
        db: Session,
        subscription: Subscription,
    ):
        db.commit()
        db.refresh(subscription)

        return subscription

    # ======================================================
    # Change Plan
    # ======================================================

    @staticmethod
    def change_plan(
        db: Session,
        subscription: Subscription,
        new_plan_id: int,
    ):
        subscription.plan_id = new_plan_id

        db.commit()
        db.refresh(subscription)

        return subscription

    # ======================================================
    # Cancel
    # ======================================================

    @staticmethod
    def cancel(
        db: Session,
        subscription: Subscription,
    ):
        subscription.cancel_at_period_end = True
        subscription.status = SubscriptionStatus.CANCELLED
        subscription.cancelled_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(subscription)

        return SubscriptionRepository.get_by_id(db, subscription.id)

    # ======================================================
    # Resume
    # ======================================================

    @staticmethod
    def resume(
        db: Session,
        subscription: Subscription,
    ):
        subscription.cancel_at_period_end = False
        subscription.status = SubscriptionStatus.ACTIVE
        subscription.cancelled_at = None

        db.commit()
        db.refresh(subscription)

        return SubscriptionRepository.get_by_id(db, subscription.id)

    # ======================================================
    # Delete
    # ======================================================

    @staticmethod
    def delete(
        db: Session,
        subscription: Subscription,
    ):
        db.delete(subscription)
        db.commit()