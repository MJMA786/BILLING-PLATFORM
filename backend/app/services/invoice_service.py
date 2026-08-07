import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.invoice import (
    Invoice,
    InvoiceStatus,
)
from app.repositories.billing_cycle_repository import (
    BillingCycleRepository,
)
from app.repositories.invoice_repository import (
    InvoiceRepository,
)
from app.schemas.invoice import (
    InvoiceCreate,
    InvoiceUpdate,
)


class InvoiceService:

    @staticmethod
    def get_all_invoices(
        db: Session,
    ):
        return InvoiceRepository.get_all(db)

    @staticmethod
    def get_invoice_by_id(
        db: Session,
        invoice_id: int,
    ):
        invoice = InvoiceRepository.get_by_id(
            db,
            invoice_id,
        )

        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invoice not found.",
            )

        return invoice

    @staticmethod
    def create_invoice(
        db: Session,
        invoice_data: InvoiceCreate,
    ):
        billing_cycle = BillingCycleRepository.get_by_id(
            db,
            invoice_data.billing_cycle_id,
        )

        if not billing_cycle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Billing cycle not found.",
            )

        existing_invoice = InvoiceRepository.get_by_billing_cycle(
            db,
            billing_cycle.id,
        )

        if existing_invoice:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invoice already exists for this billing cycle.",
            )

        subtotal = invoice_data.subtotal
        tax_amount = invoice_data.tax_amount
        total = subtotal + tax_amount

        invoice = Invoice(
            billing_cycle_id=billing_cycle.id,
            invoice_number=f"INV-{uuid.uuid4().hex[:8].upper()}",
            subtotal=subtotal,
            tax_amount=tax_amount,
            total=total,
            status=InvoiceStatus.OPEN,
            due_date=invoice_data.due_date,
        )

        return InvoiceRepository.create(
            db,
            invoice,
        )

    @staticmethod
    def update_invoice(
        db: Session,
        invoice_id: int,
        invoice_data: InvoiceUpdate,
    ):
        invoice = InvoiceRepository.get_by_id(
            db,
            invoice_id,
        )

        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invoice not found.",
            )

        update_data = invoice_data.model_dump(
            exclude_unset=True,
        )

        for key, value in update_data.items():
            setattr(invoice, key, value)

        invoice.total = (
            invoice.subtotal + invoice.tax_amount
        )

        InvoiceRepository.update(db)

        return invoice

    @staticmethod
    def get_my_invoices(
        db: Session,
        user,
    ):
        if not user.customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer profile not found.",
            )

        invoices = []

        subscriptions = user.customer.subscriptions

        for subscription in subscriptions:
            for cycle in subscription.billing_cycles:
                if cycle.invoice:
                    invoices.append(cycle.invoice)

        return invoices


    @staticmethod
    def get_my_invoice(
        db: Session,
        user,
        invoice_id: int,
    ):
        invoice = InvoiceRepository.get_by_id(
            db,
            invoice_id,
        )

        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invoice not found.",
            )

        if (
            invoice.billing_cycle.subscription.customer_id
            != user.customer.id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied.",
            )

        return invoice
    
    @staticmethod
    def delete_invoice(
        db: Session,
        invoice_id: int,
    ):
        invoice = InvoiceRepository.get_by_id(
            db,
            invoice_id,
        )

        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invoice not found.",
            )

        InvoiceRepository.delete(
            db,
            invoice,
        )

        return {
            "message": "Invoice deleted successfully."
        }

    @staticmethod
    def _get_customer_details(invoice: Invoice):
        cust_name = invoice.customer_name or "Valued Customer"
        cust_email = None

        if invoice.customer:
            cust_email = invoice.customer.billing_email
            cust_name = invoice.customer.company_name or invoice.customer.contact_person or cust_name
        elif (
            invoice.billing_cycle
            and invoice.billing_cycle.subscription
            and invoice.billing_cycle.subscription.customer
        ):
            c = invoice.billing_cycle.subscription.customer
            cust_email = c.billing_email
            cust_name = c.company_name or c.contact_person or cust_name

        return cust_name, cust_email or "customer@example.com"

    @staticmethod
    def generate_pdf(db: Session, invoice_id: int) -> bytes:
        invoice = InvoiceRepository.get_by_id(db, invoice_id)
        if not invoice:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found.")

        cust_name, cust_email = InvoiceService._get_customer_details(invoice)
        plan_name = invoice.plan_name or "Subscription Plan"

        invoice_data = {
            "invoice_number": invoice.invoice_number,
            "issued_at": invoice.issued_at.strftime("%Y-%m-%d") if invoice.issued_at else "",
            "due_date": invoice.due_date.strftime("%Y-%m-%d") if invoice.due_date else "",
            "status": invoice.status.value if hasattr(invoice.status, "value") else str(invoice.status),
            "customer_name": cust_name,
            "customer_email": cust_email,
            "plan_name": plan_name,
            "subtotal": float(invoice.subtotal),
            "tax_amount": float(invoice.tax_amount),
            "total": float(invoice.total),
        }

        from app.services.pdf_service import PDFService
        return PDFService.generate_invoice_pdf(invoice_data)

    @staticmethod
    def send_invoice_email(db: Session, invoice_id: int):
        invoice = InvoiceRepository.get_by_id(db, invoice_id)
        if not invoice:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found.")

        cust_name, cust_email = InvoiceService._get_customer_details(invoice)

        if not cust_email or cust_email == "customer@example.com":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Customer email not found.")

        from app.services.email_service import EmailService
        EmailService.send_invoice_generated_email(cust_email, cust_name, invoice.invoice_number, float(invoice.total))
        return {"message": f"Invoice email sent successfully to {cust_email}."}

    @staticmethod
    def mark_paid(db: Session, invoice_id: int):
        invoice = InvoiceRepository.get_by_id(db, invoice_id)
        if not invoice:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found.")

        invoice.status = InvoiceStatus.PAID
        InvoiceRepository.update(db)

        # Trigger Payment Success Email
        try:
            cust_name, cust_email = InvoiceService._get_customer_details(invoice)
            if cust_email and cust_email != "customer@example.com":
                from app.services.email_service import EmailService
                EmailService.send_payment_success_email(cust_email, cust_name, float(invoice.total), invoice.invoice_number)
        except Exception as e:
            print(f"[MarkPaid] Email notification warning: {e}")

        return invoice

    @staticmethod
    def void_invoice(db: Session, invoice_id: int):
        invoice = InvoiceRepository.get_by_id(db, invoice_id)
        if not invoice:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found.")

        invoice.status = InvoiceStatus.VOID
        InvoiceRepository.update(db)
        return invoice