from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.dashboard import (
    DashboardResponse,
    DashboardAnalyticsResponse,
)
from app.services.dashboard_service import DashboardService

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


# ==========================================
# Dashboard Overview
# ==========================================

@router.get(
    "/",
    response_model=DashboardResponse,
)
def get_dashboard(
    db: Session = Depends(get_db),
):

    return DashboardService.get_dashboard_data(db)


# ==========================================
# Dashboard Analytics
# ==========================================

@router.get(
    "/analytics",
    response_model=DashboardAnalyticsResponse,
)
def get_dashboard_analytics(
    db: Session = Depends(get_db),
):

    return DashboardService.get_dashboard_analytics(db)