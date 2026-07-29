from sqlalchemy.orm import Session

from app.models.plan import Plan


class PlanRepository:

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(Plan)
            .order_by(Plan.id)
            .all()
        )

    @staticmethod
    def get_active(db: Session):
        return (
            db.query(Plan)
            .filter(Plan.active == True)
            .order_by(Plan.id)
            .all()
        )

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

    @staticmethod
    def create(
        db: Session,
        plan: Plan,
    ):
        db.add(plan)
        db.commit()
        db.refresh(plan)

        return plan

    @staticmethod
    def update(db: Session):
        db.commit()

    @staticmethod
    def deactivate(
        db: Session,
        plan: Plan,
    ):
        plan.active = False

        db.commit()
        db.refresh(plan)

        return plan