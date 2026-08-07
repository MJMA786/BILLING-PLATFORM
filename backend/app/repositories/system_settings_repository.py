from sqlalchemy.orm import Session
from app.models.system_settings import SystemSettings
from app.schemas.system_settings import SystemSettingsUpdate
from app.core.enums import Currency


class SystemSettingsRepository:
    @staticmethod
    def get(db: Session) -> SystemSettings:
        settings = db.query(SystemSettings).first()
        if not settings:
            settings = SystemSettings(
                company_name="Subly Platform",
                company_email="support@subly.com",
                company_phone="+1 (800) 555-0199",
                company_address="100 Innovation Way, Suite 400, San Francisco, CA 94105",
                invoice_prefix="INV",
                next_invoice_number=1001,
                default_currency=Currency.USD,
                default_tax_percentage=18.00,
                timezone="UTC",
                date_format="DD/MM/YYYY",
                support_email="support@subly.com",
                support_phone="+1 (800) 555-0199",
                email_notifications_enabled=True,
                maintenance_mode=False,
                allow_new_registrations=True,
                smtp_sender_name="Subly Platform",
                smtp_sender_email="noreply@subly.com",
            )
            db.add(settings)
            db.commit()
            db.refresh(settings)
        return settings

    @staticmethod
    def update(db: Session, settings_in: SystemSettingsUpdate) -> SystemSettings:
        settings = SystemSettingsRepository.get(db)
        update_data = settings_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if hasattr(settings, field) and value is not None:
                if field == "default_tax_percentage":
                    value = float(value)
                setattr(settings, field, value)
        db.commit()
        db.refresh(settings)
        return settings
