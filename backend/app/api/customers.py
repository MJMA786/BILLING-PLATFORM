from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.customer import (
    CustomerUpdate,
    CustomerResponse,
)
from app.services.customer_service import CustomerService

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.get(
    "/",
    response_model=list[CustomerResponse]
)
def get_customers(db: Session = Depends(get_db)):
    return CustomerService.get_all_customers(db)


@router.get(
    "/{customer_id}",
    response_model=CustomerResponse
)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):
    return CustomerService.get_customer_by_id(db, customer_id)


@router.put(
    "/{customer_id}",
    response_model=CustomerResponse
)
def update_customer(
    customer_id: int,
    customer: CustomerUpdate,
    db: Session = Depends(get_db)
):
    return CustomerService.update_customer(
        db,
        customer_id,
        customer,
    )


@router.delete(
    "/{customer_id}"
)
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):
    return CustomerService.delete_customer(
        db,
        customer_id,
    )