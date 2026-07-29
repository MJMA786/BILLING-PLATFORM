from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_current_active_user,
    require_admin,
)
from app.database.session import get_db
from app.schemas.plan import (
    PlanCreate,
    PlanRead,
    PlanUpdate,
)
from app.services.plan_service import PlanService

router = APIRouter(
    prefix="/plans",
    tags=["Plans"],
)


# ==========================
# Customer Endpoints
# ==========================

@router.get(
    "/",
    response_model=list[PlanRead],
)
def get_active_plans(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return PlanService.get_active_plans(db)


# ==========================
# Admin Endpoints
# ==========================

@router.get(
    "/all",
    response_model=list[PlanRead],
)
def get_all_plans(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PlanService.get_all_plans(db)


@router.post(
    "/",
    response_model=PlanRead,
    status_code=status.HTTP_201_CREATED,
)
def create_plan(
    plan: PlanCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PlanService.create_plan(
        db,
        plan,
    )


@router.put(
    "/{plan_id}",
    response_model=PlanRead,
)
def update_plan(
    plan_id: int,
    plan: PlanUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PlanService.update_plan(
        db,
        plan_id,
        plan,
    )


@router.patch(
    "/{plan_id}/deactivate",
    response_model=PlanRead,
)
def deactivate_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return PlanService.deactivate_plan(
        db,
        plan_id,
    )