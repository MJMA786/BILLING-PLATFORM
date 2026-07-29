from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.plan import Plan
from app.repositories.plan_repository import PlanRepository
from app.schemas.plan import (
    PlanCreate,
    PlanUpdate,
)


class PlanService:

    @staticmethod
    def get_all_plans(db: Session):
        return PlanRepository.get_all(db)

    @staticmethod
    def get_active_plans(db: Session):
        return PlanRepository.get_active(db)

    @staticmethod
    def get_plan_by_id(
        db: Session,
        plan_id: int,
    ):
        plan = PlanRepository.get_by_id(
            db,
            plan_id,
        )

        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plan not found",
            )

        return plan

    @staticmethod
    def create_plan(
        db: Session,
        plan_data: PlanCreate,
    ):
        existing_plan = PlanRepository.get_by_name(
            db,
            plan_data.name,
        )

        if existing_plan:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Plan with this name already exists",
            )

        plan = Plan(
            name=plan_data.name,
            description=plan_data.description,
            price=plan_data.price,
            currency=plan_data.currency,
            interval=plan_data.interval,
            active=plan_data.active,
        )

        return PlanRepository.create(
            db,
            plan,
        )

    @staticmethod
    def update_plan(
        db: Session,
        plan_id: int,
        plan_data: PlanUpdate,
    ):
        plan = PlanRepository.get_by_id(
            db,
            plan_id,
        )

        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plan not found",
            )

        if (
            plan_data.name
            and plan_data.name != plan.name
        ):
            existing_plan = PlanRepository.get_by_name(
                db,
                plan_data.name,
            )

            if existing_plan:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Plan name already exists",
                )

        update_data = plan_data.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(plan, key, value)

        PlanRepository.update(db)

        return plan

    @staticmethod
    def deactivate_plan(
        db: Session,
        plan_id: int,
    ):
        plan = PlanRepository.get_by_id(
            db,
            plan_id,
        )

        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plan not found",
            )

        return PlanRepository.deactivate(
            db,
            plan,
        )