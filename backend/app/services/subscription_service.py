from datetime import datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User

from app.models.subscription import (
    Subscription,
    SubscriptionStatus,
)

from app.models.billing_cycle import (
    BillingCycle,
    BillingCycleStatus,
)

from app.models.invoice import (
    Invoice,
    InvoiceStatus,
)

from app.models.payment import (
    Payment,
    PaymentStatus,
)

from app.repositories.customer_repository import (
    CustomerRepository,
)

from app.repositories.subscription_repository import (
    SubscriptionRepository,
)

from app.repositories.plan_repository import (
    PlanRepository,
)

from app.repositories.billing_cycle_repository import (
    BillingCycleRepository,
)

from app.repositories.invoice_repository import (
    InvoiceRepository,
)

from app.repositories.payment_repository import (
    PaymentRepository,
)

from app.services.email_service import (
    EmailService,
)


class SubscriptionService:

    # =====================================================
    # Get All Subscriptions
    # =====================================================

    @staticmethod
    def get_all_subscriptions(
        db: Session,
    ):
        return SubscriptionRepository.get_all(db)

    # =====================================================
    # Get Subscription By ID
    # =====================================================

    @staticmethod
    def get_subscription_by_id(
        db: Session,
        subscription_id: int,
    ):
        subscription = (
            SubscriptionRepository.get_by_id(
                db,
                subscription_id,
            )
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscription not found.",
            )

        return subscription

    # =====================================================
    # Get Logged-in Customer Subscription
    # =====================================================

    @staticmethod
    def get_my_subscription(
        db: Session,
        user: User,
    ):
        customer = user.customer

        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer profile not found.",
            )

        subscription = (
            SubscriptionRepository.get_my_subscription(
                db,
                customer.id,
            )
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No active subscription found.",
            )

        return subscription

    # =====================================================
    # Create Subscription
    # =====================================================

    @staticmethod
    def create_subscription(
        db: Session,
        user: User,
        plan_id: int,
        customer_id: int | None = None,
    ):
        if customer_id is not None:
            customer = CustomerRepository.get_by_id(db, customer_id)
        else:
            customer = user.customer

        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer profile not found.",
            )

        plan = PlanRepository.get_by_id(
            db,
            plan_id,
        )

        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plan not found.",
            )

        if not plan.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Selected plan is inactive.",
            )

        existing_subscription = (
            SubscriptionRepository.get_active_by_customer(
                db,
                customer.id,
            )
        )

        if existing_subscription:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Customer already has an active subscription.",
            )

        now = datetime.utcnow()
                # =====================================================
        # Trial Period
        # =====================================================

        trial_end = None
        subscription_status = SubscriptionStatus.ACTIVE

        if plan.trial_days > 0:
            subscription_status = SubscriptionStatus.TRIAL
            trial_end = now + timedelta(days=plan.trial_days)

        # =====================================================
        # Billing Period
        # =====================================================

        if plan.billing_interval.value == "monthly":
            period_end = now + timedelta(days=30)

        elif plan.billing_interval.value == "annual":
            period_end = now + timedelta(days=365)

        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported billing interval.",
            )

        # =====================================================
        # Create Subscription
        # =====================================================

        subscription = Subscription(
            customer_id=customer.id,
            plan_id=plan.id,

            status=subscription_status,

            trial_ends_at=trial_end,

            start_date=now,

            current_period_start=now,
            current_period_end=period_end,

            renews_at=period_end,

            auto_renew=True,
            cancel_at_period_end=False,
        )

        created_subscription = (
            SubscriptionRepository.create(
                db,
                subscription,
            )
        )

        # =====================================================
        # Create Billing Cycle
        # =====================================================

        billing_cycle = BillingCycle(
            subscription_id=created_subscription.id,

            cycle_start=created_subscription.current_period_start,
            cycle_end=created_subscription.current_period_end,

            status=BillingCycleStatus.PENDING,
        )

        created_billing_cycle = (
            BillingCycleRepository.create(
                db,
                billing_cycle,
            )
        )

        # =====================================================
        # Invoice Calculation
        # =====================================================

        subtotal = float(plan.price)

        tax_amount = round(
            subtotal * 0.18,
            2,
        )

        discount_amount = 0.0

        total = subtotal + tax_amount - discount_amount
                # =====================================================
        # Create Invoice
        # =====================================================

        invoice = Invoice(
            billing_cycle_id=created_billing_cycle.id,

            customer_id=customer.id,

            invoice_number=f"INV-{created_billing_cycle.id:06d}",

            subtotal=subtotal,

            tax_amount=tax_amount,

            discount_amount=discount_amount,

            total=total,

            currency=plan.currency,

            status=InvoiceStatus.OPEN,

            due_date=created_subscription.current_period_end,
        )

        created_invoice = (
            InvoiceRepository.create(
                db,
                invoice,
            )
        )

        # =====================================================
        # Create Initial Payment
        # =====================================================

        payment = Payment(
            invoice_id=created_invoice.id,

            amount=total,

            currency=plan.currency,

            status=PaymentStatus.PENDING,

            gateway_reference=f"GW-{created_invoice.id:06d}",
        )

        PaymentRepository.create(
            db,
            payment,
        )

        # =====================================================
        # Email Notifications
        # =====================================================

        try:

            EmailService.send_subscription_created_email(
                customer.billing_email,
                customer.company_name,
                plan.name,
                total,
            )

            EmailService.send_invoice_generated_email(
                customer.billing_email,
                customer.company_name,
                created_invoice.invoice_number,
                total,
            )

        except Exception:
            # Email failures should never interrupt subscription creation.
            pass

        # =====================================================
        # Return Complete Subscription
        # =====================================================

        return SubscriptionRepository.get_by_id(
            db,
            created_subscription.id,
        )

    # =====================================================
    # Cancel Subscription
    # =====================================================

    @staticmethod
    def cancel_subscription(
        db: Session,
        subscription_id: int,
    ):
        subscription = SubscriptionRepository.get_by_id(
            db,
            subscription_id,
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscription not found.",
            )
        return SubscriptionRepository.cancel(
            db,
            subscription,
        )

    # =====================================================
    # Resume Subscription
    # =====================================================

    @staticmethod
    def resume_subscription(
        db: Session,
        subscription_id: int,
    ):
        subscription = SubscriptionRepository.get_by_id(
            db,
            subscription_id,
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscription not found.",
            )

        return SubscriptionRepository.resume(
            db,
            subscription,
        )

    # =====================================================
    # Upgrade Subscription
    # =====================================================

    @staticmethod
    def upgrade_subscription(
        db: Session,
        subscription_id: int,
        new_plan_id: int,
    ):
        subscription = SubscriptionRepository.get_by_id(
            db,
            subscription_id,
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscription not found.",
            )

        new_plan = PlanRepository.get_by_id(
            db,
            new_plan_id,
        )

        if not new_plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plan not found.",
            )

        if not new_plan.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Selected plan is inactive.",
            )

        subscription.plan_id = new_plan.id
        subscription.updated_at = datetime.utcnow()

        SubscriptionRepository.update(
            db,
            subscription,
        )

        return SubscriptionRepository.get_by_id(
            db,
            subscription.id,
        )

    # =====================================================
    # Downgrade Subscription
    # =====================================================

    @staticmethod
    def downgrade_subscription(
        db: Session,
        subscription_id: int,
        new_plan_id: int,
    ):
        subscription = SubscriptionRepository.get_by_id(
            db,
            subscription_id,
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscription not found.",
            )

        new_plan = PlanRepository.get_by_id(
            db,
            new_plan_id,
        )

        if not new_plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plan not found.",
            )

        if not new_plan.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Selected plan is inactive.",
            )

        subscription.plan_id = new_plan.id
        subscription.updated_at = datetime.utcnow()

        SubscriptionRepository.update(
            db,
            subscription,
        )

        return SubscriptionRepository.get_by_id(
            db,
            subscription.id,
        )
            # =====================================================
    # Get Customer Subscriptions
    # =====================================================

    @staticmethod
    def get_customer_subscriptions(
        db: Session,
        customer_id: int,
    ):
        return SubscriptionRepository.get_by_customer(
            db,
            customer_id,
        )

    # =====================================================
    # Get Active Customer Subscription
    # =====================================================

    @staticmethod
    def get_active_subscription(
        db: Session,
        customer_id: int,
    ):
        subscription = (
            SubscriptionRepository.get_active_by_customer(
                db,
                customer_id,
            )
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No active subscription found.",
            )

        return subscription

    # =====================================================
    # Delete Subscription
    # =====================================================

    @staticmethod
    def delete_subscription(
        db: Session,
        subscription_id: int,
    ):
        subscription = SubscriptionRepository.get_by_id(
            db,
            subscription_id,
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscription not found.",
            )

        SubscriptionRepository.delete(
            db,
            subscription,
        )

        return {
            "message": "Subscription deleted successfully."
        }

    # =====================================================
    # Subscription Statistics
    # =====================================================

    @staticmethod
    def get_subscription_statistics(
        db: Session,
    ):
        subscriptions = SubscriptionRepository.get_all(db)

        total = len(subscriptions)

        active = sum(
            1
            for s in subscriptions
            if s.status == SubscriptionStatus.ACTIVE
        )

        trial = sum(
            1
            for s in subscriptions
            if s.status == SubscriptionStatus.TRIAL
        )

        cancelled = sum(
            1
            for s in subscriptions
            if s.status == SubscriptionStatus.CANCELLED
        )

        expired = sum(
            1
            for s in subscriptions
            if s.status == SubscriptionStatus.EXPIRED
        )

        past_due = sum(
            1
            for s in subscriptions
            if s.status == SubscriptionStatus.PAST_DUE
        )

        return {
            "total": total,
            "active": active,
            "trial": trial,
            "cancelled": cancelled,
            "expired": expired,
            "past_due": past_due,
        }