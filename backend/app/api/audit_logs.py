from fastapi import (
    APIRouter,
    Depends,
    status,
)
from sqlalchemy.orm import Session

from app.core.dependencies import require_admin
from app.database.session import get_db
from app.schemas.audit_log import (
    AuditLogCreate,
    AuditLogRead,
)
from app.services.audit_log_service import (
    AuditLogService,
)

router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit Logs"],
)


# ==========================================================
# Get All Logs
# ==========================================================

@router.get(
    "/",
    response_model=list[AuditLogRead],
)
def get_all_logs(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return AuditLogService.get_all_logs(
        db,
    )


# ==========================================================
# Get Log By ID
# ==========================================================

@router.get(
    "/{log_id}",
    response_model=AuditLogRead,
)
def get_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return AuditLogService.get_log_by_id(
        db,
        log_id,
    )


# ==========================================================
# Create Log
# ==========================================================

@router.post(
    "/",
    response_model=AuditLogRead,
    status_code=status.HTTP_201_CREATED,
)
def create_log(
    log: AuditLogCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return AuditLogService.create_log(
        db,
        log,
    )


# ==========================================================
# Delete Log
# ==========================================================

@router.delete(
    "/{log_id}",
)
def delete_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return AuditLogService.delete_log(
        db,
        log_id,
    )