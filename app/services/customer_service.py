from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.customer_repository import CustomerRepository
from app.repositories.user_repository import UserRepository
from app.schemas.customer import CustomerUpdate


class CustomerService:

    @staticmethod
    def get_all_customers(db: Session):
        return CustomerRepository.get_all(db)

    @staticmethod
    def get_customer_by_id(
        db: Session,
        customer_id: int,
    ):
        customer = CustomerRepository.get_by_id(
            db,
            customer_id,
        )

        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found",
            )

        return customer

    @staticmethod
    def update_customer(
        db: Session,
        customer_id: int,
        customer_data: CustomerUpdate,
    ):

        customer = CustomerRepository.get_by_id(
            db,
            customer_id,
        )

        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found",
            )

        existing_customer = CustomerRepository.get_by_email(
            db,
            customer_data.email,
        )

        if (
            existing_customer
            and existing_customer.id != customer.id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use",
            )

        customer.name = customer_data.name
        customer.email = customer_data.email
        customer.billing_country = customer_data.billing_country

        # Keep linked User in sync
        if customer.user_id:

            user = UserRepository.get_by_id(
                db,
                customer.user_id,
            )

            if user:
                user.name = customer_data.name
                user.email = customer_data.email

        db.commit()
        db.refresh(customer)

        return customer

    @staticmethod
    def delete_customer(
        db: Session,
        customer_id: int,
    ):

        customer = CustomerRepository.get_by_id(
            db,
            customer_id,
        )

        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found",
            )

        # Delete linked user account
        if customer.user_id:

            user = UserRepository.get_by_id(
                db,
                customer.user_id,
            )

            if user:
                db.delete(user)

        db.delete(customer)
        db.commit()

        return {
            "message": "Customer deleted successfully",
        }