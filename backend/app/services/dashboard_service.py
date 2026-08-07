from sqlalchemy.orm import Session

from app.repositories.dashboard_repository import DashboardRepository


class DashboardService:
    """
    Service responsible for preparing
    dashboard data for the Admin panel.
    """

    # ==========================================================
    # Dashboard Overview
    # ==========================================================

    @staticmethod
    def get_dashboard_data(
        db: Session,
    ):

        # --------------------------------------
        # Statistics
        # --------------------------------------

        customer_count = DashboardRepository.get_customer_count(db)

        active_customer_count = (
            DashboardRepository.get_active_customer_count(db)
        )

        plan_count = DashboardRepository.get_plan_count(db)

        active_plan_count = (
            DashboardRepository.get_active_plan_count(db)
        )

        subscription_count = (
            DashboardRepository.get_total_subscription_count(db)
        )

        active_subscription_count = (
            DashboardRepository.get_active_subscription_count(db)
        )

        (
            total_invoices,
            paid_invoices,
            pending_invoices,
        ) = DashboardRepository.get_invoice_counts(db)

        (
            successful_payments,
            failed_payments,
        ) = DashboardRepository.get_payment_counts(db)

        total_revenue = (
            DashboardRepository.get_total_revenue(db)
        )

        outstanding_amount = (
            DashboardRepository.get_outstanding_amount(db)
        )

        stats = {

            "customers": customer_count,

            "active_customers": active_customer_count,

            "plans": plan_count,

            "active_plans": active_plan_count,

            "subscriptions": subscription_count,

            "active_subscriptions": active_subscription_count,

            "revenue": total_revenue,

            # Temporary estimation
            "annual_revenue": round(
                total_revenue * 12,
                2,
            ),

            "outstanding_amount": outstanding_amount,

            "total_invoices": total_invoices,

            "paid_invoices": paid_invoices,

            "pending_invoices": pending_invoices,

            "successful_payments": successful_payments,

            "failed_payments": failed_payments,
        }

        # --------------------------------------
        # Recent Activity
        # --------------------------------------

        recent_customers = (
            DashboardRepository.get_recent_customers(db)
        )

        recent_invoices = (
            DashboardRepository.get_recent_invoices(db)
        )

        recent_payments = (
            DashboardRepository.get_recent_payments(db)
        )

        # --------------------------------------
        # Notifications
        # --------------------------------------

        notifications = []

        due_today = (
            DashboardRepository.get_due_today_count(db)
        )

        if due_today:

            notifications.append({

                "type": "warning",

                "title": "Invoices Due",

                "message": f"{due_today} invoice(s) are due today.",

                "icon": "bi-clock-history",

            })

        failed_payment_count = (
            DashboardRepository.get_failed_payment_count(db)
        )

        if failed_payment_count:

            notifications.append({

                "type": "danger",

                "title": "Failed Payments",

                "message": f"{failed_payment_count} payment(s) failed.",

                "icon": "bi-exclamation-circle-fill",

            })

        new_customers = (
            DashboardRepository.get_new_customer_count(db)
        )

        if new_customers:

            notifications.append({

                "type": "success",

                "title": "New Customers",

                "message": f"{new_customers} customer(s) registered today.",

                "icon": "bi-person-plus-fill",

            })

        trial_subscriptions = (
            DashboardRepository.get_trial_subscription_count(db)
        )

        if trial_subscriptions:

            notifications.append({

                "type": "info",

                "title": "Trial Subscriptions",

                "message": f"{trial_subscriptions} subscription(s) are currently in trial.",

                "icon": "bi-hourglass-split",

            })

        # --------------------------------------
        # System Health
        # --------------------------------------

        system_health = {

            "database": "online",

            "api": "online",

            "billing": "online",

            "notifications": "online",

        }

        # --------------------------------------
        # Final Response
        # --------------------------------------

        return {

            "stats": stats,

            "recent_customers": recent_customers,

            "recent_invoices": recent_invoices,

            "recent_payments": recent_payments,

            "notifications": notifications,

            "system_health": system_health,

        }

    # ==========================================================
    # Dashboard Analytics
    # ==========================================================

    @staticmethod
    def get_dashboard_analytics(
        db: Session,
    ):

        monthly_revenue = (
            DashboardRepository.get_monthly_revenue(db)
        )

        subscription_distribution = (
            DashboardRepository.get_subscription_distribution(db)
        )

        return {

            "monthly_revenue": monthly_revenue,

            "subscription_distribution": subscription_distribution,

        }