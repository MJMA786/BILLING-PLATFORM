from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.customer_dashboard import (
    CustomerDashboardResponse,
)
from app.services.customer_dashboard_service import (
    CustomerDashboardService,
)
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/customer/dashboard",
    tags=["Customer Dashboard"],
)


@router.get(
    "/",
    response_model=CustomerDashboardResponse,
)
def get_customer_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return CustomerDashboardService.get_dashboard(
        db,
        current_user,
    )