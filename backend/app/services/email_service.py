import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from app.config.settings import settings

logger = logging.getLogger(__name__)

class EmailService:
    @staticmethod
    def send_email(to_email: str, subject: str, html_content: str) -> bool:
        """
        Sends an HTML email via SMTP using application settings.
        """
        smtp_host = getattr(settings, "SMTP_HOST", "smtp.gmail.com")
        smtp_port = getattr(settings, "SMTP_PORT", 587)
        smtp_username = getattr(settings, "SMTP_USERNAME", "")
        smtp_password = getattr(settings, "SMTP_PASSWORD", "")
        email_from = getattr(settings, "SMTP_FROM_EMAIL", f"Subly Platform <{smtp_username}>" if smtp_username else "noreply@subly.com")

        if not smtp_username or not smtp_password:
            logger.info(
                f"[Email Simulated] To: {to_email} | Subject: '{subject}'"
            )
            return True

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = Header(subject, "utf-8").encode()
            msg["From"] = email_from
            msg["To"] = to_email

            part = MIMEText(html_content, "html", "utf-8")
            msg.attach(part)

            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_username, smtp_password)
                server.sendmail(email_from, [to_email], msg.as_string())

            logger.info(f"[Email Sent Successfully] To: {to_email} | Subject: '{subject}'")
            return True
        except Exception as e:
            logger.error(f"[Email Send Failed] To: {to_email} | Error: {str(e)}")
            return False

    @classmethod
    def send_welcome_email(cls, to_email: str, name: str):
        subject = "Welcome to Subly! 🚀"
        html = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4F46E5;">Welcome to Subly, {name}!</h2>
            <p>Thank you for joining <strong>Subly - Subscription Management & Automated Billing Platform</strong>.</p>
            <p>You can now manage your active subscriptions, view invoices, and track payments seamlessly from your portal.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888;">© Subly Platform. All rights reserved.</p>
        </div>
        """
        return cls.send_email(to_email, subject, html)

    @classmethod
    def send_google_welcome_email(cls, to_email: str, name: str):
        subject = "Welcome to Subly via Google Sign-In! ⚡"
        html = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4F46E5;">Hello {name}, Welcome to Subly!</h2>
            <p>Your account was successfully registered using <strong>Google Sign-In</strong> on Subly.</p>
            <p>Log in anytime using your Google account to access your Customer Portal.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888;">© Subly Platform. All rights reserved.</p>
        </div>
        """
        return cls.send_email(to_email, subject, html)

    @classmethod
    def send_subscription_created_email(cls, to_email: str, name: str, plan_name: str, price: float):
        subject = f"Subscription Activated: {plan_name} 🎉"
        html = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #10B981;">Subscription Activated!</h2>
            <p>Hi {name},</p>
            <p>Your subscription to <strong>{plan_name}</strong> (₹{price:.2f}) has been successfully activated.</p>
            <p>Your downstream billing cycle and initial invoice have been generated.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888;">© Subly Platform.</p>
        </div>
        """
        return cls.send_email(to_email, subject, html)

    @classmethod
    def send_subscription_cancelled_email(cls, to_email: str, name: str, plan_name: str):
        subject = f"Subscription Cancelled: {plan_name}"
        html = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #EF4444;">Subscription Cancelled</h2>
            <p>Hi {name},</p>
            <p>Your subscription for <strong>{plan_name}</strong> has been cancelled.</p>
            <p>You can resubscribe or choose a new plan at any time from your customer dashboard.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888;">© Subly Platform.</p>
        </div>
        """
        return cls.send_email(to_email, subject, html)

    @classmethod
    def send_invoice_generated_email(cls, to_email: str, name: str, invoice_number: str, total: float):
        subject = f"New Invoice Generated: #{invoice_number}"
        html = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4F46E5;">Invoice #{invoice_number}</h2>
            <p>Hi {name},</p>
            <p>A new invoice has been generated for your account for <strong>₹{total:.2f}</strong>.</p>
            <p>You can view and download your invoice PDF directly from your customer portal.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888;">© Subly Platform.</p>
        </div>
        """
        return cls.send_email(to_email, subject, html)

    @classmethod
    def send_payment_success_email(cls, to_email: str, name: str, amount: float, invoice_number: str):
        subject = f"Payment Successful: ₹{amount:.2f} for Invoice #{invoice_number} ✅"
        html = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #10B981;">Payment Received!</h2>
            <p>Hi {name},</p>
            <p>We have successfully received your payment of <strong>₹{amount:.2f}</strong> for Invoice <strong>#{invoice_number}</strong>.</p>
            <p>Thank you for your prompt business!</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888;">© Subly Platform.</p>
        </div>
        """
        return cls.send_email(to_email, subject, html)

    @classmethod
    def send_payment_failed_email(cls, to_email: str, name: str, amount: float, invoice_number: str):
        subject = f"Payment Attempt Failed for Invoice #{invoice_number} ⚠️"
        html = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #EF4444;">Payment Attempt Failed</h2>
            <p>Hi {name},</p>
            <p>Your payment attempt of <strong>₹{amount:.2f}</strong> for Invoice <strong>#{invoice_number}</strong> could not be processed.</p>
            <p>Please check your payment details or contact support.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888;">© Subly Platform.</p>
        </div>
        """
        return cls.send_email(to_email, subject, html)

    @classmethod
    def send_password_reset_email(cls, to_email: str, reset_link: str):
        subject = "Reset Your Password - Subly 🔒"
        html = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4F46E5;">Password Reset Request</h2>
            <p>We received a request to reset your password for your Subly account.</p>
            <p>Click the link below to set a new password:</p>
            <p><a href="{reset_link}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
            <p style="font-size: 12px; color: #666;">If you did not request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888;">© Subly Platform.</p>
        </div>
        """
        return cls.send_email(to_email, subject, html)

    @classmethod
    def send_password_reset_code(cls, to_email: str, name: str, code: str):
        subject = "Your Password Reset Code - Subly 🔒"
        html = f"""
        <div style="font-family: Arial, sans-serif; padding: 30px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #4F46E5; margin: 0; font-size: 28px;">Subly</h1>
                <p style="color: #666; font-size: 14px; margin-top: 4px;">Subscription & Billing Platform</p>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <h2 style="color: #1F2937; font-size: 20px;">Password Reset Request</h2>
            <p>Hi {name},</p>
            <p>We received a request to reset your password. Use the verification code below to proceed with resetting your password:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4F46E5; background-color: #F3F4F6; padding: 12px 28px; border-radius: 8px; display: inline-block; border: 1px dashed #4F46E5;">{code}</span>
            </div>
            <p style="font-size: 14px; color: #4B5563;">This code is valid for <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0 20px 0;" />
            <p style="font-size: 12px; color: #9CA3AF; text-align: center;">© Subly Platform. All rights reserved.</p>
        </div>
        """
        return cls.send_email(to_email, subject, html)

    @classmethod
    def send_plan_purchased_email(cls, to_email: str, name: str, plan_name: str, amount: float, tx_ref: str):
        subject = f"Plan Purchased Successfully: {plan_name} 🎉"
        html = f"""
        <div style="font-family: Arial, sans-serif; padding: 30px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #4F46E5; margin: 0; font-size: 28px;">Subly</h1>
                <p style="color: #666; font-size: 14px; margin-top: 4px;">Subscription & Billing Platform</p>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <h2 style="color: #10B981; font-size: 20px;">Plan Purchase Confirmed! 🎉</h2>
            <p>Hi <strong>{name}</strong>,</p>
            <p>Thank you for purchasing the <strong>{plan_name}</strong> plan! Your payment of <strong>${amount:.2f}</strong> has been successfully processed.</p>
            <div style="background-color: #F3F4F6; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 4px 0; font-size: 14px;"><strong>Transaction Ref:</strong> {tx_ref}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Plan:</strong> {plan_name}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Total Paid:</strong> ${amount:.2f}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> Active</p>
            </div>
            <p style="font-size: 14px; color: #4B5563;">Your subscription is active. You can manage your plan and view tax receipts anytime in your Subly Customer Portal.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0 20px 0;" />
            <p style="font-size: 12px; color: #9CA3AF; text-align: center;">© Subly Platform. All rights reserved.</p>
        </div>
        """
        return cls.send_email(to_email, subject, html)

    @classmethod
    def send_support_ticket_email(cls, to_email: str, name: str, ticket_ref: str, category: str, priority: str, subject_text: str, message: str):
        subject = f"Support Request Confirmation: {ticket_ref} - {subject_text}"
        html = f"""
        <div style="font-family: Arial, sans-serif; padding: 30px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #4F46E5; margin: 0; font-size: 28px;">Subly Customer Desk</h1>
                <p style="color: #666; font-size: 14px; margin-top: 4px;">Support Ticket Acknowledgment</p>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <h2 style="color: #10B981; font-size: 20px;">Ticket Received: {ticket_ref}</h2>
            <p>Hi <strong>{name}</strong>,</p>
            <p>Thank you for reaching out to Subly Customer Support. Your support request has been logged and assigned to a support engineer.</p>
            <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 4px 0; font-size: 14px;"><strong>Ticket Reference:</strong> {ticket_ref}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Category:</strong> {category}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Priority:</strong> {priority}</p>
                <p style="margin: 4px 0; font-size: 14px;"><strong>Subject:</strong> {subject_text}</p>
                <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 12px 0;" />
                <p style="margin: 4px 0; font-size: 14px; color: #4B5563;"><strong>Your Message:</strong></p>
                <p style="margin: 4px 0; font-size: 13px; color: #374151; white-space: pre-wrap;">{message}</p>
            </div>
            <p style="font-size: 14px; color: #4B5563;">Our priority support desk team will inspect your account details and respond shortly.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0 20px 0;" />
            <p style="font-size: 12px; color: #9CA3AF; text-align: center;">© Subly Platform. All rights reserved.</p>
        </div>
        """
        return cls.send_email(to_email, subject, html)
