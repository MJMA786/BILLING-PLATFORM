import { useState } from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import {
  Receipt,
  CreditCard,
  Calendar,
  Hash,
  Wallet,
  CheckCircle2,
  User as UserIcon,
} from "lucide-react";
import invoiceService from "../../services/invoiceService";
import { formatCurrency, formatDate } from "../../utils/formatters";

function PaymentViewModal({
  show,
  payment,
  onClose,
}) {
  const [downloading, setDownloading] = useState(false);

  if (!payment) return null;

  const handleDownloadPDF = async () => {
    if (!payment.invoice?.id) return;
    try {
      setDownloading(true);
      await invoiceService.downloadPDF(payment.invoice.id);
    } catch (err) {
      alert("Failed to download PDF invoice receipt.");
    } finally {
      setDownloading(false);
    }
  };

  const getBadge = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "succeeded":
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "danger";
      case "refunded":
        return "info";
      default:
        return "secondary";
    }
  };

  const customer = payment.invoice?.customer || payment.invoice?.billing_cycle?.subscription?.customer;
  const customerName =
    customer?.company_name ||
    customer?.contact_person ||
    payment.customer_name ||
    "Valued Customer";

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          Payment Details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="text-center mb-4">
          <div
            className="rounded-circle bg-primary-subtle d-inline-flex align-items-center justify-content-center"
            style={{
              width: 70,
              height: 70,
            }}
          >
            <Receipt
              size={34}
              className="text-primary"
            />
          </div>

          <h3 className="fw-bold mt-3">
            {formatCurrency(payment.amount)}
          </h3>

          <Badge bg={getBadge(payment.status)} className="px-3 py-1.5 text-uppercase">
            {payment.status}
          </Badge>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <small className="text-muted d-block mb-1">
              <UserIcon size={15} className="me-2 text-primary" />
              Customer Name
            </small>
            <h6 className="fw-bold text-dark mb-0">
              {customerName}
            </h6>
          </div>

          <div className="col-md-6">
            <small className="text-muted d-block mb-1">
              <Hash size={15} className="me-2 text-primary" />
              Invoice Number
            </small>
            <h6 className="fw-semibold mb-0">
              {payment.invoice?.invoice_number || `INV-${payment.invoice_id}`}
            </h6>
          </div>

          <div className="col-md-6">
            <small className="text-muted d-block mb-1">
              <Wallet size={15} className="me-2 text-primary" />
              Invoice Total
            </small>
            <h6 className="fw-semibold mb-0">
              {formatCurrency(payment.invoice?.total || payment.amount)}
            </h6>
          </div>

          <div className="col-md-6">
            <small className="text-muted d-block mb-1">
              <CreditCard size={15} className="me-2 text-primary" />
              Payment Method
            </small>
            <h6 className="fw-semibold text-capitalize mb-0">
              {payment.payment_method || "Manual"}
            </h6>
          </div>

          <div className="col-md-6">
            <small className="text-muted d-block mb-1">
              <CheckCircle2 size={15} className="me-2 text-primary" />
              Gateway Reference
            </small>
            <h6 className="fw-semibold font-monospace mb-0" style={{ wordBreak: "break-all" }}>
              {payment.gateway_reference || "-"}
            </h6>
          </div>

          <div className="col-md-6">
            <small className="text-muted d-block mb-1">
              <Calendar size={15} className="me-2 text-primary" />
              Attempted At
            </small>
            <h6 className="fw-semibold mb-0">
              {formatDate(payment.attempted_at, true)}
            </h6>
          </div>

          <div className="col-md-6">
            <small className="text-muted d-block mb-1">
              Status
            </small>
            <h6 className="fw-semibold text-uppercase mb-0">
              {payment.status}
            </h6>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0">
        <Button
          variant="secondary"
          onClick={onClose}
          className="rounded-3 px-4"
        >
          Close
        </Button>

        {payment.invoice?.id && (
          <Button
            variant="primary"
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="rounded-3 px-4 fw-semibold shadow-sm"
          >
            {downloading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Downloading...
              </>
            ) : (
              "Download Receipt PDF"
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default PaymentViewModal;