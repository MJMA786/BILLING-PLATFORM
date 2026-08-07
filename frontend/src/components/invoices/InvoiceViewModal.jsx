import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import invoiceService from "../../services/invoiceService";
import { formatCurrency, formatDate } from "../../utils/formatters";

function InvoiceViewModal({ show, onClose, invoice, onPay }) {
  const [downloading, setDownloading] = useState(false);

  if (!invoice) return null;

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      await invoiceService.downloadPDF(invoice.id);
    } catch (err) {
      alert("Failed to download PDF invoice.");
    } finally {
      setDownloading(false);
    }
  };

  const customerName =
    invoice.customer_name ||
    invoice.billing_cycle?.subscription?.customer?.name ||
    "Valued Customer";

  const planName =
    invoice.plan_name ||
    invoice.billing_cycle?.subscription?.plan?.name ||
    "Subscription Plan";

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold text-dark">
          Invoice #{invoice.invoice_number}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <div className="row g-4">
          <div className="col-md-6">
            <h6 className="text-muted small fw-medium">Invoice Number</h6>
            <p className="fw-bold text-dark mb-0">{invoice.invoice_number}</p>
          </div>

          <div className="col-md-6">
            <h6 className="text-muted small fw-medium">Status</h6>
            <span className={`badge px-3 py-2 text-uppercase ${invoice.status === "paid" ? "bg-success" : "bg-warning text-dark"}`}>
              {invoice.status}
            </span>
          </div>

          <div className="col-md-6">
            <h6 className="text-muted small fw-medium">Customer Name</h6>
            <p className="fw-bold text-dark mb-0">{customerName}</p>
          </div>

          <div className="col-md-6">
            <h6 className="text-muted small fw-medium">Plan Name</h6>
            <p className="fw-bold text-dark mb-0">{planName}</p>
          </div>

          <div className="col-md-4">
            <h6 className="text-muted small fw-medium">Subtotal</h6>
            <p className="fw-semibold text-dark mb-0">{formatCurrency(invoice.subtotal)}</p>
          </div>

          <div className="col-md-4">
            <h6 className="text-muted small fw-medium">Tax (18%)</h6>
            <p className="fw-semibold text-dark mb-0">{formatCurrency(invoice.tax_amount)}</p>
          </div>

          <div className="col-md-4">
            <h6 className="text-muted small fw-medium">Total Amount</h6>
            <p className="fw-bold text-success fs-5 mb-0">{formatCurrency(invoice.total)}</p>
          </div>

          <div className="col-md-6">
            <h6 className="text-muted small fw-medium">Issued Date</h6>
            <p className="text-dark mb-0">{formatDate(invoice.issued_at, true)}</p>
          </div>

          <div className="col-md-6">
            <h6 className="text-muted small fw-medium">Due Date</h6>
            <p className="text-dark mb-0">{formatDate(invoice.due_date, true)}</p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 pb-3 px-4">
        <Button variant="secondary" onClick={onClose} className="rounded-3 px-4">
          Close
        </Button>

        {invoice.status !== "paid" && (
          <Button
            variant="success"
            onClick={() => {
              onClose();
              if (onPay) onPay(invoice);
            }}
            className="rounded-3 px-4 fw-semibold shadow-sm"
          >
            🔒 Pay Now
          </Button>
        )}

        <Button
          variant="primary"
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="rounded-3 px-4 fw-semibold"
        >
          {downloading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Downloading...
            </>
          ) : (
            <>
              <i className="bi bi-file-earmark-pdf me-2"></i> Download PDF
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default InvoiceViewModal;