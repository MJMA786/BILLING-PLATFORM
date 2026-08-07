from fastapi import (
    APIRouter,
    Depends,
    status,
)
from sqlalchemy.orm import Session

from app.core.dependencies import require_admin
from app.database.session import get_db
from app.schemas.payment_retry import (
    PaymentRetryCreate,
    PaymentRetryRead,
    PaymentRetryUpdate,
)
from app.services.payment_retry_service import (
    PaymentRetryService,
)

router = APIRouter(
    prefix="/payment-retries",
    tags=["Payment Retries"],
)


# ==========================================================
# Get All Retries
# ==========================================================

@router.get(
    "/",
    response_model=list[PaymentRetryRead],
)
def get_all_retries(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PaymentRetryService.get_all_retries(
        db,
    )


# ==========================================================
# Get Retry By ID
# ==========================================================

@router.get(
    "/{retry_id}",
    response_model=PaymentRetryRead,
)
def get_retry(
    retry_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PaymentRetryService.get_retry_by_id(
        db,
        retry_id,
    )


# ==========================================================
# Get Retries For Payment
# ==========================================================

@router.get(
    "/payment/{payment_id}",
    response_model=list[PaymentRetryRead],
)
def get_payment_retries(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PaymentRetryService.get_payment_retries(
        db,
        payment_id,
    )


# ==========================================================
# Create Retry
# ==========================================================

@router.post(
    "/",
    response_model=PaymentRetryRead,
    status_code=status.HTTP_201_CREATED,
)
def create_retry(
    retry: PaymentRetryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PaymentRetryService.create_retry(
        db,
        retry,
    )


# ==========================================================
# Mark Success
# ==========================================================

@router.patch(
    "/{retry_id}/success",
    response_model=PaymentRetryRead,
)
def mark_success(
    retry_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PaymentRetryService.mark_success(
        db,
        retry_id,
    )


# ==========================================================
# Mark Failed
# ==========================================================

@router.patch(
    "/{retry_id}/failed",
    response_model=PaymentRetryRead,
)
def mark_failed(
    retry_id: int,
    retry: PaymentRetryUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PaymentRetryService.mark_failed(
        db,
        retry_id,
        retry,
    )


# ==========================================================
# Delete Retry
# ==========================================================

@router.delete(
    "/{retry_id}",
)
def delete_retry(
    retry_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PaymentRetryService.delete_retry(
        db,
        retry_id,
    )