from sqlalchemy.orm import Session

from app.models.plan import Plan


class PlanRepository:

    # ======================================================
    # Get All Plans
    # ======================================================

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(Plan)
            .order_by(Plan.id)
            .all()
        )

    # ======================================================
    # Get Active Plans
    # ======================================================

    @staticmethod
    def get_active(db: Session):
        return (
            db.query(Plan)
            .filter(Plan.is_active.is_(True))
            .order_by(Plan.id)
            .all()
        )

    # ======================================================
    # Get By ID
    # ======================================================

    @staticmethod
    def get_by_id(
        db: Session,
        plan_id: int,
    ):
        return (
            db.query(Plan)
            .filter(Plan.id == plan_id)
            .first()
        )

    # ======================================================
    # Get By Name
    # ======================================================

    @staticmethod
    def get_by_name(
        db: Session,
        name: str,
    ):
        return (
            db.query(Plan)
            .filter(Plan.name == name)
            .first()
        )

    # ======================================================
    # Create
    # ======================================================

    @staticmethod
    def create(
        db: Session,
        plan: Plan,
    ):
        db.add(plan)
        db.commit()
        db.refresh(plan)

        return plan

    # ======================================================
    # Update
    # ======================================================

    @staticmethod
    def update(db: Session):
        db.commit()

    # ======================================================
    # Deactivate
    # ======================================================

    @staticmethod
    def deactivate(
        db: Session,
        plan: Plan,
    ):
        plan.is_active = False

        db.commit()
        db.refresh(plan)

        return plan