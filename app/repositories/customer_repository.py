from typing import Optional

from sqlalchemy.orm import Session

from app.models.customer import Customer


class CustomerRepository:

    @staticmethod
    def get_all(db: Session):
        return db.query(Customer).order_by(Customer.id).all()

    @staticmethod
    def get_by_id(db: Session, customer_id: int):
        return (
            db.query(Customer)
            .filter(Customer.id == customer_id)
            .first()
        )

    @staticmethod
    def get_by_email(db: Session, email: str):
        return (
            db.query(Customer)
            .filter(Customer.email == email)
            .first()
        )

    @staticmethod
    def get_by_user_id(db: Session, user_id: int):
        return (
            db.query(Customer)
            .filter(Customer.user_id == user_id)
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        name: str,
        email: str,
        billing_country: str,
        user_id: Optional[int] = None,
    ):
        customer = Customer(
            name=name,
            email=email,
            billing_country=billing_country,
            user_id=user_id,
        )

        db.add(customer)
        db.commit()
        db.refresh(customer)

        return customer

    @staticmethod
    def update(db: Session):
        db.commit()

    @staticmethod
    def delete(db: Session, customer: Customer):
        db.delete(customer)
        db.commit()