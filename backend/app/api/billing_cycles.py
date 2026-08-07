from fastapi import (
    APIRouter,
    Depends,
    status,
)
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_current_active_user,
    require_admin,
)
from app.database.session import get_db
from app.schemas.billing_cycle import (
    BillingCycleCreate,
    BillingCycleRead,
    BillingCycleUpdate,
)
from app.services.billing_cycle_service import (
    BillingCycleService,
)

router = APIRouter(
    prefix="/billing-cycles",
    tags=["Billing Cycles"],
)


# ==========================================================
# Customer Endpoints
# ==========================================================

@router.get(
    "/me/{subscription_id}",
    response_model=list[BillingCycleRead],
)
def get_my_billing_cycles(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return BillingCycleService.get_subscription_cycles(
        db,
        subscription_id,
    )


# ==========================================================
# Admin Endpoints
# ==========================================================

@router.get(
    "/",
    response_model=list[BillingCycleRead],
)
def get_all_billing_cycles(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return BillingCycleService.get_all_billing_cycles(
        db,
    )


@router.get(
    "/{billing_cycle_id}",
    response_model=BillingCycleRead,
)
def get_billing_cycle(
    billing_cycle_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return BillingCycleService.get_billing_cycle_by_id(
        db,
        billing_cycle_id,
    )


@router.post(
    "/",
    response_model=BillingCycleRead,
    status_code=status.HTTP_201_CREATED,
)
def create_billing_cycle(
    billing_cycle: BillingCycleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return BillingCycleService.create_billing_cycle(
        db,
        billing_cycle,
    )


@router.put(
    "/{billing_cycle_id}",
    response_model=BillingCycleRead,
)
def update_billing_cycle(
    billing_cycle_id: int,
    billing_cycle: BillingCycleUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return BillingCycleService.update_billing_cycle(
        db,
        billing_cycle_id,
        billing_cycle,
    )


@router.delete(
    "/{billing_cycle_id}",
)
def delete_billing_cycle(
    billing_cycle_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return BillingCycleService.delete_billing_cycle(
        db,
        billing_cycle_id,
    )