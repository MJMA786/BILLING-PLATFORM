from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog
from app.repositories.audit_log_repository import (
    AuditLogRepository,
)
from app.schemas.audit_log import AuditLogCreate


class AuditLogService:

    @staticmethod
    def get_all_logs(
        db: Session,
    ):
        return AuditLogRepository.get_all(db)

    @staticmethod
    def get_log_by_id(
        db: Session,
        log_id: int,
    ):
        log = AuditLogRepository.get_by_id(
            db,
            log_id,
        )

        if not log:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Audit log not found.",
            )

        return log

    @staticmethod
    def create_log(
        db: Session,
        log_data: AuditLogCreate,
    ):
        log = AuditLog(
            entity_type=log_data.entity_type,
            entity_id=log_data.entity_id,
            event=log_data.event,
            performed_by=log_data.performed_by,
        )

        return AuditLogRepository.create(
            db,
            log,
        )

    @staticmethod
    def log(
        db: Session,
        entity_type: str,
        entity_id: int,
        event: str,
        performed_by: int | None = None,
    ):
        log = AuditLog(
            entity_type=entity_type,
            entity_id=entity_id,
            event=event,
            performed_by=performed_by,
        )

        return AuditLogRepository.create(
            db,
            log,
        )

    @staticmethod
    def delete_log(
        db: Session,
        log_id: int,
    ):
        log = AuditLogRepository.get_by_id(
            db,
            log_id,
        )

        if not log:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Audit log not found.",
            )

        AuditLogRepository.delete(
            db,
            log,
        )

        return {
            "message": "Audit log deleted successfully."
        }