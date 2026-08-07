from datetime import datetime, timedelta
import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

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
from app.repositories.subscription_repository import (
    SubscriptionRepository,
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


class BillingService:

    @staticmethod
    def bill_subscription(
        db: Session,
        subscription_id: int,
        payment_method: str = "Manual",
    ):
        """
        Complete Billing Flow

        Subscription
            ↓
        Billing Cycle
            ↓
        Invoice
            ↓
        Payment
        """

        subscription = SubscriptionRepository.get_by_id(
            db,
            subscription_id,
        )

        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Subscription not found.",
            )

        now = datetime.utcnow()

        # ---------------------------------------
        # Billing Cycle
        # ---------------------------------------

        billing_cycle = BillingCycle(
            subscription_id=subscription.id,
            cycle_start=subscription.current_period_start,
            cycle_end=subscription.current_period_end,
            status=BillingCycleStatus.INVOICED,
        )

        billing_cycle = BillingCycleRepository.create(
            db,
            billing_cycle,
        )

        # ---------------------------------------
        # Invoice
        # ---------------------------------------

        subtotal = float(subscription.plan.price)
        tax_amount = round(subtotal * 0.18, 2)
        total = subtotal + tax_amount

        invoice = Invoice(
            billing_cycle_id=billing_cycle.id,
            invoice_number=f"INV-{uuid.uuid4().hex[:8].upper()}",
            subtotal=subtotal,
            tax_amount=tax_amount,
            total=total,
            status=InvoiceStatus.OPEN,
            due_date=now + timedelta(days=7),
        )

        invoice = InvoiceRepository.create(
            db,
            invoice,
        )

        # ---------------------------------------
        # Payment
        # ---------------------------------------

        payment = Payment(
            invoice_id=invoice.id,
            amount=invoice.total,
            status=PaymentStatus.SUCCEEDED,
            gateway_name="Manual",
            gateway_reference=f"PAY-{uuid.uuid4().hex[:12].upper()}",
            payment_method=payment_method,
        )

        payment = PaymentRepository.create(
            db,
            payment,
        )

        # ---------------------------------------
        # Invoice Paid
        # ---------------------------------------

        invoice.status = InvoiceStatus.PAID
        InvoiceRepository.update(db)

        return {
            "subscription": subscription,
            "billing_cycle": billing_cycle,
            "invoice": invoice,
            "payment": payment,
        }