from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from app.models.audit_log import AuditLog


class AuditLogRepository:

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(AuditLog)
            .options(
                joinedload(AuditLog.user)
            )
            .order_by(
                AuditLog.created_at.desc()
            )
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        log_id: int,
    ):
        return (
            db.query(AuditLog)
            .options(
                joinedload(AuditLog.user)
            )
            .filter(
                AuditLog.id == log_id
            )
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        audit_log: AuditLog,
    ):
        db.add(audit_log)
        db.commit()
        db.refresh(audit_log)

        return audit_log

    @staticmethod
    def delete(
        db: Session,
        audit_log: AuditLog,
    ):
        db.delete(audit_log)
        db.commit()