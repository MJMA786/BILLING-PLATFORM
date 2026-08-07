import { useNavigate } from "react-router-dom";
import { Download, CreditCard, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { formatCurrency, formatDate, getStatusBadgeClass } from "../../utils/formatters";

export default function RecentPayments({ payments = [] }) {
  const navigate = useNavigate();

  return (
    <div className="card border shadow-sm rounded-4 h-100 bg-white">
      <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
        <div>
          <h5 className="fw-bold text-dark font-display mb-1">Recent Payments</h5>
          <small className="text-secondary fw-medium">Your latest processed subscription receipts.</small>
        </div>

        <button
          className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fw-semibold micro-text"
          onClick={() => navigate("/customer/payments")}
        >
          View All
        </button>
      </div>

      <div className="card-body p-0 mt-3">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light micro-text text-uppercase text-muted fw-bold">
              <tr>
                <th className="ps-4">Reference / Txn</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th className="pe-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted small">
                    No payment transactions recorded yet.
                  </td>
                </tr>
              ) : (
                payments.slice(0, 5).map((payment) => {
                  const txnCode = payment.transaction_id || payment.invoice_number || `PAY-${payment.id}`;
                  const method = payment.payment_method || "Online Card";
                  const dateStr = payment.payment_date || payment.attempted_at || payment.created_at;

                  return (
                    <tr key={payment.id}>
                      <td className="ps-4 fw-bold text-dark small font-monospace">{txnCode}</td>
                      <td className="small text-secondary">{formatDate(dateStr)}</td>
                      <td className="fw-bold text-dark small">{formatCurrency(payment.amount)}</td>
                      <td>
                        <div className="d-flex align-items-center gap-1.5 small text-secondary">
                          <CreditCard size={14} className="text-primary" />
                          <span className="text-capitalize">{method}</span>
                        </div>
                      </td>
                      <td className="pe-4">
                        <span className={`badge ${getStatusBadgeClass(payment.status)} text-uppercase px-2 py-0.5 micro-text`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}