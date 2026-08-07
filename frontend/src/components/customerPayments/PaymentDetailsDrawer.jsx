import { useState } from "react";
import { X, Download, Receipt, CheckCircle } from "lucide-react";
import invoiceService from "../../services/invoiceService";
import { formatCurrency, formatDate, getStatusBadgeClass } from "../../utils/formatters";

export default function PaymentDetailsDrawer({ show, payment, onClose }) {
  const [downloading, setDownloading] = useState(false);

  if (!show || !payment) return null;

  const invId = payment.invoice_id || payment.invoice?.id;
  const invNumber = payment.invoice?.invoice_number || payment.invoice_number || `INV-${invId}`;
  const amount = Number(payment.amount || 0);
  const gatewayRef = payment.gateway_reference || payment.transactionId || `PAY-${payment.id}`;
  const status = payment.status || "succeeded";
  const attemptedAt = formatDate(payment.attempted_at || payment.date, true);

  const handleDownloadPDF = async () => {
    if (!invId) {
      alert("Associated invoice record not found.");
      return;
    }
    try {
      setDownloading(true);
      await invoiceService.downloadPDF(invId);
    } catch (err) {
      alert("Failed to download PDF receipt.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          background: "rgba(15,23,42,0.45)",
          zIndex: 1040,
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="position-fixed top-0 end-0 bg-white shadow-lg d-flex flex-column"
        style={{
          width: "430px",
          maxWidth: "100%",
          height: "100vh",
          zIndex: 1050,
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div className="border-bottom p-4 d-flex justify-content-between align-items-center bg-light">
          <div>
            <h5 className="fw-bold text-dark mb-0">Payment Details</h5>
            <small className="text-muted">Transaction Receipt & Details</small>
          </div>

          <button className="btn btn-light rounded-circle border-0 p-2" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex-grow-1">
          <div className="text-center mb-4">
            <div
              className="bg-success-subtle rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
              style={{ width: 68, height: 68 }}
            >
              <CheckCircle size={34} className="text-success" />
            </div>

            <h3 className="fw-bold text-dark mb-1">{formatCurrency(amount)}</h3>
            <span className={`badge ${getStatusBadgeClass(status)} text-uppercase px-3 py-1`}>
              {status}
            </span>
          </div>

          <div className="card border-0 bg-light rounded-4 mb-4 p-3">
            <div className="d-flex justify-content-between mb-2.5">
              <span className="text-muted small">Invoice Reference</span>
              <strong className="text-dark small">{invNumber}</strong>
            </div>

            <div className="d-flex justify-content-between mb-2.5">
              <span className="text-muted small">Gateway Reference</span>
              <strong className="text-dark small text-truncate" style={{ maxWidth: 180 }}>{gatewayRef}</strong>
            </div>

            <div className="d-flex justify-content-between mb-2.5">
              <span className="text-muted small">Payment Date</span>
              <strong className="text-dark small">{attemptedAt}</strong>
            </div>

            <div className="d-flex justify-content-between mb-2.5">
              <span className="text-muted small">Payment Method</span>
              <strong className="text-dark small text-capitalize">{payment.payment_method || "Card"}</strong>
            </div>

            <div className="d-flex justify-content-between">
              <span className="text-muted small">Payment Gateway</span>
              <strong className="text-dark small">{payment.gateway_name || "Subly Automated Gateway"}</strong>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="d-grid gap-2">
            <button
              className="btn btn-primary py-2.5 rounded-3 fw-semibold"
              disabled={downloading}
              onClick={handleDownloadPDF}
            >
              {downloading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Downloading...
                </>
              ) : (
                <>
                  <Download size={18} className="me-2" /> Download PDF Receipt
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}