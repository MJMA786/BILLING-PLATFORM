import { useState, useMemo } from "react";
import { Eye, CheckCircle, RotateCcw, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import paymentService from "../../services/paymentService";
import { formatCurrency, formatDate, getStatusBadgeClass } from "../../utils/formatters";
import { useToast } from "../../context/ToastContext";

function PaymentTable({ payments, loading, onView, onRefresh }) {
  const { showToast } = useToast();
  const [loadingId, setLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleMarkSuccess = async (payment) => {
    try {
      setLoadingId(payment.id);
      await paymentService.markSuccess(payment.id);
      showToast("Payment marked as Succeeded!", "success");
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to mark payment success.", "danger");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRefund = async (payment) => {
    if (!window.confirm("Are you sure you want to refund this payment?")) return;
    try {
      setLoadingId(payment.id);
      await paymentService.refund(payment.id);
      showToast("Payment refunded successfully.", "warning");
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to refund payment.", "danger");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (payment) => {
    if (!window.confirm(`Are you sure you want to delete payment record (Ref: ${payment.gateway_reference || payment.id})?`)) return;
    try {
      setLoadingId(payment.id);
      await paymentService.delete(payment.id);
      showToast("Payment record deleted successfully.", "success");
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to delete payment.", "danger");
    } finally {
      setLoadingId(null);
    }
  };

  const totalPages = Math.ceil(payments.length / itemsPerPage) || 1;
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return payments.slice(start, start + itemsPerPage);
  }, [payments, currentPage]);

  if (loading) {
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading payments...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-header bg-white border-0 py-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="fw-bold mb-0 text-dark">Payment Records</h5>
            <small className="text-muted">Showing {payments.length} transactions</small>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table align-middle table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Invoice #</th>
              <th>Customer Name</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Gateway Ref</th>
              <th>Status</th>
              <th>Attempt Date</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedPayments.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-5 text-muted">
                  No payment records found.
                </td>
              </tr>
            ) : (
              paginatedPayments.map((payment) => {
                const invNumber = payment.invoice?.invoice_number || `INV-${payment.invoice_id}`;
                const customer = payment.invoice?.customer || payment.invoice?.billing_cycle?.subscription?.customer;
                const customerName =
                  customer?.company_name ||
                  customer?.contact_person ||
                  payment.customer_name ||
                  "-";

                const pStatus = String(payment.status || "").toLowerCase();

                return (
                  <tr key={payment.id}>
                    <td className="fw-semibold text-dark">{invNumber}</td>
                    <td className="fw-medium text-dark">{customerName}</td>
                    <td className="fw-bold text-dark">{formatCurrency(payment.amount)}</td>
                    <td className="text-capitalize text-secondary small">{payment.payment_method || "Manual"}</td>
                    <td className="small text-muted">{payment.gateway_reference || "-"}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(payment.status)} text-uppercase px-2.5 py-1`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="small text-secondary">{formatDate(payment.attempted_at, true)}</td>
                    <td className="text-center">
                      <div className="d-flex align-items-center justify-content-center gap-1">
                        <button
                          className="btn btn-outline-primary btn-sm rounded-2 p-1.5"
                          title="View Details"
                          onClick={() => onView(payment)}
                        >
                          <Eye size={15} />
                        </button>

                        {pStatus !== "succeeded" && pStatus !== "paid" && (
                          <button
                            className="btn btn-outline-success btn-sm rounded-2 p-1.5"
                            title="Mark Succeeded"
                            disabled={loadingId === payment.id}
                            onClick={() => handleMarkSuccess(payment)}
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}

                        {pStatus === "succeeded" && (
                          <button
                            className="btn btn-outline-warning btn-sm rounded-2 p-1.5"
                            title="Refund Payment"
                            disabled={loadingId === payment.id}
                            onClick={() => handleRefund(payment)}
                          >
                            <RotateCcw size={15} />
                          </button>
                        )}

                        <button
                          className="btn btn-outline-danger btn-sm rounded-2 p-1.5"
                          title="Delete Payment Record"
                          disabled={loadingId === payment.id}
                          onClick={() => handleDelete(payment)}
                        >
                          <Trash2 size={15} />
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

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="card-footer bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Page {currentPage} of {totalPages}
          </small>
          <div className="d-flex gap-1">
            <button
              className="btn btn-outline-secondary btn-sm rounded-2 px-2.5"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              className="btn btn-outline-secondary btn-sm rounded-2 px-2.5"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentTable;