from datetime import datetime
from math import ceil


class ProrationService:

    @staticmethod
    def calculate_upgrade(
        current_plan_price: float,
        new_plan_price: float,
        current_period_start: datetime,
        current_period_end: datetime,
    ):
        """
        Calculate the prorated amount for upgrading a subscription.
        """

        today = datetime.utcnow()

        total_days = (
            current_period_end - current_period_start
        ).days

        remaining_days = max(
            (current_period_end - today).days,
            0,
        )

        used_days = total_days - remaining_days

        if total_days <= 0:
            total_days = 1

        unused_credit = (
            current_plan_price / total_days
        ) * remaining_days

        new_plan_cost = (
            new_plan_price / total_days
        ) * remaining_days

        amount_payable = max(
            new_plan_cost - unused_credit,
            0,
        )

        return {
            "total_days": total_days,
            "used_days": used_days,
            "remaining_days": remaining_days,
            "unused_credit": round(unused_credit, 2),
            "new_plan_cost": round(new_plan_cost, 2),
            "amount_payable": round(amount_payable, 2),
        }

    @staticmethod
    def calculate_downgrade(
        current_plan_price: float,
        new_plan_price: float,
        current_period_start: datetime,
        current_period_end: datetime,
    ):
        """
        Calculate customer credit after downgrading.
        """

        today = datetime.utcnow()

        total_days = (
            current_period_end - current_period_start
        ).days

        remaining_days = max(
            (current_period_end - today).days,
            0,
        )

        if total_days <= 0:
            total_days = 1

        remaining_value_current = (
            current_plan_price / total_days
        ) * remaining_days

        remaining_value_new = (
            new_plan_price / total_days
        ) * remaining_days

        credit = max(
            remaining_value_current - remaining_value_new,
            0,
        )

        return {
            "remaining_days": remaining_days,
            "credit": round(credit, 2),
        }

    @staticmethod
    def days_remaining(
        current_period_end: datetime,
    ):
        return max(
            (current_period_end - datetime.utcnow()).days,
            0,
        )

    @staticmethod
    def renewal_progress(
        current_period_start: datetime,
        current_period_end: datetime,
    ):
        total = (
            current_period_end - current_period_start
        ).days

        remaining = max(
            (current_period_end - datetime.utcnow()).days,
            0,
        )

        if total <= 0:
            return 100

        completed = total - remaining

        percentage = ceil(
            (completed / total) * 100
        )

        return min(
            max(percentage, 0),
            100,
        )