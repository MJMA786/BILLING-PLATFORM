import random
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.core.dependencies import get_current_user
from app.services.email_service import EmailService

router = APIRouter(prefix="/support", tags=["Support"])


class SupportTicketRequest(BaseModel):
    category: str = Field(..., example="Billing & Payments")
    priority: str = Field(..., example="Medium")
    subject: str = Field(..., min_length=3, example="Question regarding recent invoice")
    message: str = Field(..., min_length=5, example="Can you please clarify tax charges on invoice #1001?")


@router.post("/ticket", status_code=status.HTTP_201_CREATED)
def create_support_ticket(
    payload: SupportTicketRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Submits a customer support ticket and dispatches HTML confirmation emails.
    """
    ticket_ref = f"TICKET-#{random.randint(100000, 999999)}"

    recipient_email = current_user.email
    recipient_name = current_user.name or "Valued Customer"

    # Dispatch confirmation email to customer via EmailService
    email_sent = EmailService.send_support_ticket_email(
        to_email=recipient_email,
        name=recipient_name,
        ticket_ref=ticket_ref,
        category=payload.category,
        priority=payload.priority,
        subject_text=payload.subject,
        message=payload.message,
    )

    return {
        "ticket_ref": ticket_ref,
        "email_sent": email_sent,
        "message": f"Support ticket {ticket_ref} created and email confirmation sent to {recipient_email}.",
    }
