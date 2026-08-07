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
from app.schemas.payment import (
    PaymentCreate,
    PaymentRead,
    PaymentCheckoutRequest,
)
from app.services.payment_service import PaymentService

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


# ==========================================================
# Customer Endpoints
# ==========================================================

@router.get(
    "/me",
    response_model=list[PaymentRead],
)
def get_my_payments(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return PaymentService.get_my_payments(
        db,
        current_user,
    )


@router.post(
    "/",
    response_model=PaymentRead,
    status_code=status.HTTP_201_CREATED,
)
def create_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return PaymentService.create_payment(
        db,
        current_user,
        payment,
    )


@router.post(
    "/checkout",
    status_code=status.HTTP_200_OK,
)
def process_checkout(
    data: PaymentCheckoutRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return PaymentService.process_checkout(
        db,
        current_user,
        plan_id=data.plan_id,
        invoice_id=data.invoice_id,
        payment_method=data.payment_method,
    )


# ==========================================================
# Admin Endpoints
# ==========================================================

@router.get(
    "/",
    response_model=list[PaymentRead],
)
def get_all_payments(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PaymentService.get_all_payments(db)


@router.get(
    "/{payment_id}",
    response_model=PaymentRead,
)
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PaymentService.get_payment_by_id(
        db,
        payment_id,
    )


@router.patch(
    "/{payment_id}/success",
    response_model=PaymentRead,
)
def mark_payment_success(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PaymentService.mark_success(
        db,
        payment_id,
    )


@router.patch(
    "/{payment_id}/failed",
    response_model=PaymentRead,
)
def mark_payment_failed(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PaymentService.mark_failed(
        db,
        payment_id,
    )


@router.patch(
    "/{payment_id}/refund",
    response_model=PaymentRead,
)
def refund_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PaymentService.refund_payment(
        db,
        payment_id,
    )


@router.delete(
    "/{payment_id}",
)
def delete_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PaymentService.delete_payment(
        db,
        payment_id,
    )