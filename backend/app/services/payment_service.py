import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.invoice import InvoiceStatus
from app.models.payment import (
    Payment,
    PaymentStatus,
)
from app.models.user import User
from app.repositories.invoice_repository import InvoiceRepository
from app.repositories.payment_repository import PaymentRepository
from app.schemas.payment import PaymentCreate


class PaymentService:

    @staticmethod
    def get_all_payments(
        db: Session,
    ):
        return PaymentRepository.get_all(db)

    @staticmethod
    def get_payment_by_id(
        db: Session,
        payment_id: int,
    ):
        payment = PaymentRepository.get_by_id(
            db,
            payment_id,
        )

        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found.",
            )

        return payment

    @staticmethod
    def get_my_payments(
        db: Session,
        user: User,
    ):
        if not user.customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer profile not found.",
            )

        return PaymentRepository.get_by_customer(
            db,
            user.customer.id,
        )

    @staticmethod
    def create_payment(
        db: Session,
        user: User,
        payment_data: PaymentCreate,
    ):
        if not user.customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer profile not found.",
            )

        invoice = InvoiceRepository.get_by_id(
            db,
            payment_data.invoice_id,
        )

        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invoice not found.",
            )

        existing = PaymentRepository.get_by_invoice(
            db,
            invoice.id,
        )

        for payment in existing:
            if payment.status == PaymentStatus.SUCCEEDED:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invoice already paid.",
                )

        payment = Payment(
            invoice_id=invoice.id,
            amount=invoice.total,
            payment_method=payment_data.payment_method,
            gateway_name="Manual",
            gateway_reference=f"PAY-{uuid.uuid4().hex[:12].upper()}",
            status=PaymentStatus.SUCCEEDED,
        )

        payment = PaymentRepository.create(
            db,
            payment,
        )

        invoice.status = InvoiceStatus.PAID

        db.commit()

        return PaymentRepository.get_by_id(
            db,
            payment.id,
        )

    @staticmethod
    def refund_payment(
        db: Session,
        payment_id: int,
    ):
        payment = PaymentRepository.get_by_id(
            db,
            payment_id,
        )

        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found.",
            )

        if payment.status != PaymentStatus.SUCCEEDED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only successful payments can be refunded.",
            )

        payment = PaymentRepository.refund(
            db,
            payment,
        )

        payment.invoice.status = InvoiceStatus.OPEN

        db.commit()

        return payment

    @staticmethod
    def mark_failed(
        db: Session,
        payment_id: int,
    ):
        payment = PaymentRepository.get_by_id(
            db,
            payment_id,
        )

        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found.",
            )

        return PaymentRepository.update_status(
            db,
            payment,
            PaymentStatus.FAILED,
        )

    @staticmethod
    def mark_success(
        db: Session,
        payment_id: int,
    ):
        from datetime import datetime, timezone
        from app.services.email_service import EmailService

        payment = PaymentRepository.get_by_id(
            db,
            payment_id,
        )

        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found.",
            )

        payment.status = PaymentStatus.SUCCEEDED
        payment.paid_at = datetime.now(timezone.utc)

        if payment.invoice:
            payment.invoice.status = InvoiceStatus.PAID
            payment.invoice.paid_at = datetime.now(timezone.utc)

        db.commit()

        # Send email notifications to all associated customer email addresses
        try:
            inv = payment.invoice
            cust = inv.customer if inv else None
            if not cust and inv and inv.billing_cycle and inv.billing_cycle.subscription:
                cust = inv.billing_cycle.subscription.customer

            emails = set()
            if cust and cust.billing_email:
                emails.add(cust.billing_email)
            if cust and cust.user and cust.user.email:
                emails.add(cust.user.email)

            cust_name = (cust.company_name or cust.contact_person) if cust else "Valued Customer"
            for target_email in emails:
                EmailService.send_payment_success_email(
                    target_email,
                    cust_name,
                    float(payment.amount),
                    inv.invoice_number if inv else f"PAY-{payment.id}",
                )
        except Exception as e:
            print(f"[Mark Success Email Warning]: {e}")

        return payment

    @staticmethod
    def delete_payment(
        db: Session,
        payment_id: int,
    ):
        payment = PaymentRepository.get_by_id(
            db,
            payment_id,
        )

        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found.",
            )

        PaymentRepository.delete(
            db,
            payment,
        )

        return {
            "message": "Payment deleted successfully."
        }

    @staticmethod
    def process_checkout(
        db: Session,
        user: User,
        plan_id: int | None = None,
        invoice_id: int | None = None,
        payment_method: str = "card",
    ):
        from datetime import datetime, timezone
        from app.services.subscription_service import SubscriptionService
        from app.repositories.subscription_repository import SubscriptionRepository
        from app.repositories.plan_repository import PlanRepository
        from app.services.email_service import EmailService

        if not user.customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer profile not found.",
            )

        customer = user.customer
        target_invoice = None
        plan_name = None

        if plan_id:
            plan = PlanRepository.get_by_id(db, plan_id)
            if not plan:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Plan not found.",
                )
            plan_name = plan.name

            existing_sub = SubscriptionRepository.get_active_by_customer(db, customer.id)
            if existing_sub:
                if existing_sub.plan_id != plan_id:
                    sub = SubscriptionRepository.change_plan(db, existing_sub, plan_id)
                else:
                    sub = existing_sub
            else:
                sub = SubscriptionService.create_subscription(db, user, plan_id)
            
            if sub and sub.billing_cycles:
                latest_cycle = sub.billing_cycles[-1]
                target_invoice = latest_cycle.invoice
            
            if not target_invoice and sub:
                from app.services.billing_cycle_service import BillingCycleService
                from app.services.invoice_service import InvoiceService
                from app.schemas.invoice import InvoiceCreate
                cycle = BillingCycleService.create_billing_cycle(db, sub.id)
                subtotal = float(plan.price)
                tax_amount = subtotal * 0.18
                inv_create = InvoiceCreate(
                    billing_cycle_id=cycle.id,
                    subtotal=subtotal,
                    tax_amount=tax_amount,
                    due_date=cycle.cycle_end
                )
                target_invoice = InvoiceService.create_invoice(db, inv_create)

        elif invoice_id:
            target_invoice = InvoiceRepository.get_by_id(db, invoice_id)
            if not target_invoice:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Invoice not found.",
                )
            if target_invoice.billing_cycle and target_invoice.billing_cycle.subscription and target_invoice.billing_cycle.subscription.plan:
                plan_name = target_invoice.billing_cycle.subscription.plan.name

        if not target_invoice:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to process payment: No invoice associated with this transaction.",
            )

        from app.models.payment import PaymentGateway, PaymentMethod

        # Map payment_method string to PaymentMethod enum safely
        method_map = {
            "card": PaymentMethod.CARD,
            "upi": PaymentMethod.UPI,
            "netbanking": PaymentMethod.NET_BANKING,
            "net_banking": PaymentMethod.NET_BANKING,
        }
        pm_enum = method_map.get(str(payment_method).lower(), PaymentMethod.CARD)

        # Create payment record
        gateway_ref = f"PAY-{uuid.uuid4().hex[:12].upper()}"
        payment = Payment(
            invoice_id=target_invoice.id,
            amount=target_invoice.total,
            payment_method=pm_enum,
            gateway_name=PaymentGateway.STRIPE,
            gateway_reference=gateway_ref,
            status=PaymentStatus.SUCCEEDED,
            paid_at=datetime.now(timezone.utc),
        )

        payment = PaymentRepository.create(db, payment)

        # Automatically mark invoice paid
        target_invoice.status = InvoiceStatus.PAID
        target_invoice.paid_at = datetime.now(timezone.utc)
        db.commit()

        # Send emails automatically to both user.email and customer.billing_email
        emails = set()
        if user and user.email:
            emails.add(user.email)
        if customer and customer.billing_email:
            emails.add(customer.billing_email)

        cust_name = customer.company_name or customer.contact_person or user.name

        for target_email in emails:
            if plan_name:
                try:
                    EmailService.send_plan_purchased_email(
                        target_email,
                        cust_name,
                        plan_name,
                        float(target_invoice.total),
                        gateway_ref,
                    )
                except Exception as e:
                    print(f"[Checkout Plan Email Warning]: {e}")

            try:
                EmailService.send_payment_success_email(
                    target_email,
                    cust_name,
                    float(target_invoice.total),
                    target_invoice.invoice_number,
                )
            except Exception as e:
                print(f"[Payment Success Email Warning]: {e}")

        return {
            "status": "success",
            "payment_id": payment.id,
            "gateway_reference": gateway_ref,
            "invoice_number": target_invoice.invoice_number,
            "plan_name": plan_name or "Subscription Plan",
            "amount": float(target_invoice.total),
            "message": "Payment processed successfully!",
        }