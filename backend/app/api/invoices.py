from fastapi import (
    APIRouter,
    Depends,
    status,
)
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_current_active_user,
    require_admin,
)
from app.database.session import get_db
from app.schemas.invoice import (
    InvoiceCreate,
    InvoiceRead,
    InvoiceUpdate,
)
from app.services.invoice_service import (
    InvoiceService,
)

router = APIRouter(
    prefix="/invoices",
    tags=["Invoices"],
)


# ==========================================================
# Customer Endpoints
# ==========================================================

@router.get(
    "/me",
    response_model=list[InvoiceRead],
)
def get_my_invoices(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return InvoiceService.get_my_invoices(
        db,
        current_user,
    )


@router.get(
    "/me/{invoice_id}",
    response_model=InvoiceRead,
)
def get_my_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return InvoiceService.get_my_invoice(
        db,
        current_user,
        invoice_id,
    )


# ==========================================================
# Admin Endpoints
# ==========================================================

@router.get(
    "/",
    response_model=list[InvoiceRead],
)
def get_all_invoices(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return InvoiceService.get_all_invoices(
        db,
    )


@router.get(
    "/{invoice_id}",
    response_model=InvoiceRead,
)
def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return InvoiceService.get_invoice_by_id(
        db,
        invoice_id,
    )


@router.post(
    "/",
    response_model=InvoiceRead,
    status_code=status.HTTP_201_CREATED,
)
def create_invoice(
    invoice: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return InvoiceService.create_invoice(
        db,
        invoice,
    )


@router.put(
    "/{invoice_id}",
    response_model=InvoiceRead,
)
def update_invoice(
    invoice_id: int,
    invoice: InvoiceUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return InvoiceService.update_invoice(
        db,
        invoice_id,
        invoice,
    )


@router.get(
    "/{invoice_id}/pdf",
    summary="Download Invoice PDF",
    description="Generate and download invoice as a PDF file.",
)
def download_invoice_pdf(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    from fastapi import Response
    pdf_bytes = InvoiceService.generate_pdf(db, invoice_id)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=invoice-{invoice_id}.pdf"
        },
    )


@router.post(
    "/{invoice_id}/send-email",
    summary="Email Invoice",
    description="Send invoice email notification to customer.",
)
def send_invoice_email(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return InvoiceService.send_invoice_email(db, invoice_id)


@router.patch(
    "/{invoice_id}/mark-paid",
    response_model=InvoiceRead,
    summary="Mark Invoice Paid",
)
def mark_invoice_paid(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return InvoiceService.mark_paid(db, invoice_id)


@router.patch(
    "/{invoice_id}/void",
    response_model=InvoiceRead,
    summary="Void Invoice",
)
def void_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return InvoiceService.void_invoice(db, invoice_id)


@router.delete(
    "/{invoice_id}",
)
def delete_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return InvoiceService.delete_invoice(
        db,
        invoice_id,
    )