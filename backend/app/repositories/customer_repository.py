from sqlalchemy.orm import Session

from app.models.customer import Customer, Currency


class CustomerRepository:

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(Customer)
            .order_by(Customer.id)
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        customer_id: int,
    ):
        return (
            db.query(Customer)
            .filter(Customer.id == customer_id)
            .first()
        )

    @staticmethod
    def get_by_user_id(
        db: Session,
        user_id: int,
    ):
        return (
            db.query(Customer)
            .filter(Customer.user_id == user_id)
            .first()
        )

    @staticmethod
    def get_by_billing_email(
        db: Session,
        billing_email: str,
    ):
        return (
            db.query(Customer)
            .filter(Customer.billing_email == billing_email)
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        company_name: str,
        billing_email: str,
        country: str,
        user_id: int | None = None,
        contact_person: str | None = None,
        phone: str | None = None,
        address_line1: str | None = None,
        address_line2: str | None = None,
        city: str | None = None,
        state: str | None = None,
        postal_code: str | None = None,
        tax_id: str | None = None,
        currency: Currency = Currency.USD,
        timezone: str = "UTC",
    ):
        customer = Customer(
            user_id=user_id,
            company_name=company_name,
            contact_person=contact_person,
            billing_email=billing_email,
            phone=phone,
            address_line1=address_line1,
            address_line2=address_line2,
            city=city,
            state=state,
            postal_code=postal_code,
            country=country,
            tax_id=tax_id,
            currency=currency,
            timezone=timezone,
        )

        db.add(customer)
        db.commit()
        db.refresh(customer)

        return customer

    @staticmethod
    def update(
        db: Session,
        customer: Customer,
        **kwargs,
    ):
        for key, value in kwargs.items():
            if hasattr(customer, key):
                setattr(customer, key, value)

        db.commit()
        db.refresh(customer)

        return customer

    @staticmethod
    def delete(
        db: Session,
        customer: Customer,
    ):
        db.delete(customer)
        db.commit()