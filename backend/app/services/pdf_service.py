import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT, TA_CENTER, TA_LEFT

class PDFService:
    @staticmethod
    def generate_invoice_pdf(invoice_data: dict) -> bytes:
        """
        Generates a PDF binary stream for an invoice using ReportLab.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36,
        )

        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            "InvoiceTitle",
            parent=styles["Heading1"],
            fontSize=24,
            leading=28,
            textColor=colors.HexColor("#4F46E5"),
            fontName="Helvetica-Bold",
        )

        subtitle_style = ParagraphStyle(
            "InvoiceSubTitle",
            parent=styles["Normal"],
            fontSize=10,
            leading=12,
            textColor=colors.HexColor("#64748B"),
        )

        header_right_style = ParagraphStyle(
            "HeaderRight",
            parent=styles["Normal"],
            fontSize=10,
            leading=14,
            alignment=TA_RIGHT,
            textColor=colors.HexColor("#1E293B"),
        )

        section_heading = ParagraphStyle(
            "SectionHeading",
            parent=styles["Heading3"],
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#4F46E5"),
            fontName="Helvetica-Bold",
        )

        body_style = ParagraphStyle(
            "Body",
            parent=styles["Normal"],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#334155"),
        )

        table_header_style = ParagraphStyle(
            "TableHeader",
            parent=styles["Normal"],
            fontSize=10,
            leading=12,
            fontName="Helvetica-Bold",
            textColor=colors.white,
        )

        table_body_style = ParagraphStyle(
            "TableBody",
            parent=styles["Normal"],
            fontSize=10,
            leading=12,
            textColor=colors.HexColor("#1E293B"),
        )

        table_body_right = ParagraphStyle(
            "TableBodyRight",
            parent=styles["Normal"],
            fontSize=10,
            leading=12,
            alignment=TA_RIGHT,
            textColor=colors.HexColor("#1E293B"),
        )

        elements = []

        # Header Row (Logo & Subly Brand vs Invoice Number & Dates)
        brand_p = Paragraph(
            "<b>SUBLY</b><br/><font size=9 color='#64748B'>Subscription Management & Automated Billing Platform</font>",
            title_style,
        )

        inv_num = invoice_data.get("invoice_number", "INV-000000")
        issued_date = invoice_data.get("issued_at", datetime.now().strftime("%Y-%m-%d"))
        due_date = invoice_data.get("due_date", datetime.now().strftime("%Y-%m-%d"))
        status = (invoice_data.get("status") or "DRAFT").upper()

        meta_p = Paragraph(
            f"<b>INVOICE #{inv_num}</b><br/>"
            f"Issued: {issued_date}<br/>"
            f"Due Date: {due_date}<br/>"
            f"Status: <b>{status}</b>",
            header_right_style,
        )

        header_table = Table([[brand_p, meta_p]], colWidths=[320, 220])
        header_table.setStyle(
            TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ])
        )
        elements.append(header_table)
        elements.append(Spacer(1, 15))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceAfter=15))

        # Bill To & Vendor Info
        cust_name = invoice_data.get("customer_name", "Valued Customer")
        cust_email = invoice_data.get("customer_email", "customer@example.com")

        bill_to_p = Paragraph(
            f"<b>Billed To:</b><br/>"
            f"<b>{cust_name}</b><br/>"
            f"Email: {cust_email}<br/>"
            f"Billing Country: India",
            body_style,
        )

        vendor_p = Paragraph(
            "<b>Billed By:</b><br/>"
            "<b>Subly Platform Inc.</b><br/>"
            "Email: billing@subly.com<br/>"
            "Website: https://subly.com",
            header_right_style,
        )

        details_table = Table([[bill_to_p, vendor_p]], colWidths=[300, 240])
        details_table.setStyle(
            TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ])
        )
        elements.append(details_table)
        elements.append(Spacer(1, 20))

        # Line Items Table
        plan_name = invoice_data.get("plan_name", "Subscription Plan")
        subtotal = float(invoice_data.get("subtotal", 0.0))
        tax_amount = float(invoice_data.get("tax_amount", 0.0))
        total = float(invoice_data.get("total", 0.0))

        table_data = [
            [
                Paragraph("Item & Description", table_header_style),
                Paragraph("Rate", table_header_style),
                Paragraph("Tax (18%)", table_header_style),
                Paragraph("Amount", ParagraphStyle("THRight", parent=table_header_style, alignment=TA_RIGHT)),
            ],
            [
                Paragraph(f"<b>{plan_name}</b> - Automated Subscription Billing", table_body_style),
                Paragraph(f"₹{subtotal:.2f}", table_body_style),
                Paragraph(f"₹{tax_amount:.2f}", table_body_style),
                Paragraph(f"₹{total:.2f}", table_body_right),
            ],
        ]

        item_table = Table(table_data, colWidths=[260, 90, 90, 100])
        item_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4F46E5")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("PADDING", (0, 0), (-1, -1), 8),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ])
        )
        elements.append(item_table)
        elements.append(Spacer(1, 15))

        # Summary Totals Table
        summary_data = [
            [Paragraph("Subtotal:", body_style), Paragraph(f"₹{subtotal:.2f}", table_body_right)],
            [Paragraph("Tax (18% GST):", body_style), Paragraph(f"₹{tax_amount:.2f}", table_body_right)],
            [Paragraph("<b>Total Amount:</b>", section_heading), Paragraph(f"<b>₹{total:.2f}</b>", ParagraphStyle("TotRight", parent=section_heading, alignment=TA_RIGHT))],
        ]

        summary_table = Table(summary_data, colWidths=[400, 140])
        summary_table.setStyle(
            TableStyle([
                ("ALIGN", (0, 0), (-1, -1), "RIGHT"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("PADDING", (0, 0), (-1, -1), 4),
            ])
        )
        elements.append(summary_table)
        elements.append(Spacer(1, 30))

        # Footer Terms
        footer_p = Paragraph(
            "<b>Thank you for choosing Subly!</b><br/>"
            "If you have any questions regarding this invoice, please contact support@subly.com.",
            ParagraphStyle("Footer", parent=styles["Normal"], fontSize=9, leading=12, alignment=TA_CENTER, textColor=colors.HexColor("#94A3B8")),
        )
        elements.append(footer_p)

        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()
