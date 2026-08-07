import { useState } from "react";
import { Eye, Download, CreditCard } from "lucide-react";
import invoiceService from "../../services/invoiceService";
import { formatCurrency, formatDate, getStatusBadgeClass } from "../../utils/formatters";

export default function PaymentTable({ payments, onView }) {
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownloadPDF = async (payment) => {
    const invId = payment.invoice_id || payment.invoice?.id;
    if (!invId) {
      alert("Invoice reference not found.");
      return;
    }
    try {
      setDownloadingId(payment.id);
      await invoiceService.downloadPDF(invId);
    } catch (err) {
      alert("Failed to download PDF receipt.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-header bg-white border-0 py-3">
        <h5 className="fw-bold mb-0 text-dark">Payment History</h5>
        <small className="text-muted">Showing {payments.length} transactions</small>
      </div>

      <div className="table-responsive">
        <table className="table align-middle table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Invoice #</th>
              <th>Gateway Ref</th>
              <th>Date</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-5 text-muted">
                  No payment records found.
                </td>
              </tr>
            ) : (
              payments.map((payment) => {
                const invNumber =
                  payment.invoice?.invoice_number ||
                  payment.invoice_number ||
                  `INV-${payment.invoice_id}`;
                const gatewayRef = payment.gateway_reference || payment.transactionId || "-";
                const amount = Number(payment.amount || 0);

                return (
                  <tr key={payment.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2.5">
                        <div className="bg-primary-subtle text-primary p-2.5 rounded-circle d-flex align-items-center justify-content-center">
                          <CreditCard size={18} />
                        </div>
                        <span className="fw-bold text-dark">{invNumber}</span>
                      </div>
                    </td>

                    <td className="small text-muted">{gatewayRef}</td>

                    <td className="small text-secondary">{formatDate(payment.attempted_at || payment.date, true)}</td>

                    <td className="text-capitalize text-secondary small">{payment.payment_method || "Card"}</td>

                    <td className="fw-bold text-dark">{formatCurrency(amount)}</td>

                    <td>
                      <span className={`badge ${getStatusBadgeClass(payment.status)} text-uppercase px-2 py-1`}>
                        {payment.status}
                      </span>
                    </td>

                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-1">
                        <button
                          className="btn btn-outline-primary btn-sm rounded-2 p-1.5"
                          title="View Details"
                          onClick={() => onView(payment)}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          className="btn btn-outline-success btn-sm rounded-2 p-1.5"
                          title="Download Receipt PDF"
                          disabled={downloadingId === payment.id}
                          onClick={() => handleDownloadPDF(payment)}
                        >
                          <Download size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}