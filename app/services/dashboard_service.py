from sqlalchemy.orm import Session

from app.repositories.dashboard_repository import DashboardRepository


class DashboardService:

    @staticmethod
    def get_dashboard_data(
        db: Session,
    ):

        stats = {

            "customers": DashboardRepository.get_customer_count(db),

            "plans": DashboardRepository.get_plan_count(db),

            "subscriptions": (
                DashboardRepository.get_active_subscription_count(db)
            ),

            "revenue": DashboardRepository.get_total_revenue(db),

        }

        recent_invoices = (
            DashboardRepository.get_recent_invoices(db)
        )

        notifications = []

        due_today = DashboardRepository.get_due_today_count(db)

        if due_today:

            notifications.append({

                "type": "warning",

                "title": "Invoices Due",

                "message": f"{due_today} invoice(s) are due today.",

                "icon": "bi-clock-history",

            })

        failed_payments = (
            DashboardRepository.get_failed_payment_count(db)
        )

        if failed_payments:

            notifications.append({

                "type": "danger",

                "title": "Failed Payments",

                "message": f"{failed_payments} payment(s) failed.",

                "icon": "bi-exclamation-circle-fill",

            })

        new_customers = (
            DashboardRepository.get_new_customer_count(db)
        )

        if new_customers:

            notifications.append({

                "type": "success",

                "title": "New Customers",

                "message": (
                    f"{new_customers} customer(s) registered today."
                ),

                "icon": "bi-person-plus-fill",

            })

        trial_subscriptions = (
            DashboardRepository.get_trial_subscription_count(db)
        )

        if trial_subscriptions:

            notifications.append({

                "type": "info",

                "title": "Trials",

                "message": (
                    f"{trial_subscriptions} subscription(s) are in trial."
                ),

                "icon": "bi-hourglass-split",

            })

        return {

            "stats": stats,

            "recent_invoices": recent_invoices,

            "notifications": notifications,

        }