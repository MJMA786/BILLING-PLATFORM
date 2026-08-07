from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_active_user
from app.models.user import User

from app.database.session import get_db
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionResponse,
)
from app.services.subscription_service import SubscriptionService

router = APIRouter(
    prefix="/subscriptions",
    tags=["Subscriptions"],
)


@router.get(
    "/",
    response_model=list[SubscriptionResponse],
    summary="Get All Subscriptions",
)
def get_subscriptions(
    db: Session = Depends(get_db),
):
    return SubscriptionService.get_all_subscriptions(db)


@router.get(
    "/me",
    response_model=SubscriptionResponse,
    summary="Get My Subscription",
)
def get_my_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return SubscriptionService.get_my_subscription(
        db,
        current_user,
    )


@router.get(
    "/{subscription_id}",
    response_model=SubscriptionResponse,
    summary="Get Subscription By ID",
)
def get_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
):
    return SubscriptionService.get_subscription_by_id(
        db,
        subscription_id,
    )


@router.post(
    "/",
    response_model=SubscriptionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_subscription(
    subscription: SubscriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return SubscriptionService.create_subscription(
        db=db,
        user=current_user,
        plan_id=subscription.plan_id,
        customer_id=subscription.customer_id,
    )


@router.put(
    "/{subscription_id}/cancel",
    response_model=SubscriptionResponse,
    summary="Cancel Subscription",
)
def cancel_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
):
    return SubscriptionService.cancel_subscription(
        db,
        subscription_id,
    )


@router.put(
    "/{subscription_id}/resume",
    response_model=SubscriptionResponse,
    summary="Resume Subscription",
)
def resume_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
):
    return SubscriptionService.resume_subscription(
        db,
        subscription_id,
    )


@router.delete(
    "/{subscription_id}",
    summary="Delete Subscription",
)
def delete_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
):
    return SubscriptionService.delete_subscription(
        db,
        subscription_id,
    )