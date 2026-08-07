from fastapi import (
    APIRouter,
    Depends,
)
from sqlalchemy.orm import Session

from app.core.dependencies import require_admin
from app.database.session import get_db
from app.services.billing_service import BillingService

router = APIRouter(
    prefix="/billing",
    tags=["Billing"],
)


# ==========================================================
# Generate Bill
# ==========================================================

@router.post(
    "/subscriptions/{subscription_id}",
)
def generate_bill(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return BillingService.bill_subscription(
        db,
        subscription_id,
    )