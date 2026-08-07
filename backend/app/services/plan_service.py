from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from slugify import slugify

from app.models.plan import Plan
from app.repositories.plan_repository import PlanRepository
from app.schemas.plan import (
    PlanCreate,
    PlanUpdate,
)


class PlanService:

    # ======================================================
    # Get Plans
    # ======================================================

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

    # ======================================================
    # Create Plan
    # ======================================================

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
            slug=slugify(plan_data.name),
            description=plan_data.description,
            price=plan_data.price,
            currency=plan_data.currency,
            billing_interval=plan_data.billing_interval,
            trial_days=getattr(plan_data, "trial_days", 14),
            features=getattr(plan_data, "features", {}),
            is_active=plan_data.is_active,
        )

        return PlanRepository.create(
            db,
            plan,
        )

    # ======================================================
    # Update Plan
    # ======================================================

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

        if "name" in update_data:
            update_data["slug"] = slugify(
                update_data["name"]
            )

        for key, value in update_data.items():
            setattr(plan, key, value)

        PlanRepository.update(db)

        return plan

    # ======================================================
    # Deactivate Plan
    # ======================================================

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