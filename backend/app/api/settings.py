from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.system_settings import SystemSettingsRead, SystemSettingsUpdate
from app.repositories.system_settings_repository import SystemSettingsRepository
from app.core.dependencies import get_current_user
from app.models.user import User, UserRole

router = APIRouter(prefix="/settings", tags=["System Settings"])


@router.get("/", response_model=SystemSettingsRead)
def get_settings(db: Session = Depends(get_db)):
    """
    Get current platform system settings.
    """
    return SystemSettingsRepository.get(db)


@router.put("/", response_model=SystemSettingsRead)
def update_settings(
    settings_in: SystemSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update platform system settings (Admin only).
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only platform administrators can modify system settings.",
        )

    return SystemSettingsRepository.update(db, settings_in)
