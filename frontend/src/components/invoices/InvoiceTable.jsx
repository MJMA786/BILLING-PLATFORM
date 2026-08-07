import { useState, useMemo } from "react";
import { Eye, Download, Mail, CheckCircle, XCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import invoiceService from "../../services/invoiceService";
import { formatCurrency, formatDate, getStatusBadgeClass } from "../../utils/formatters";
import { useToast } from "../../context/ToastContext";

function InvoiceTable({ invoices = [], onView, onRefresh, showAdminActions = false }) {
  const { showToast } = useToast();
  const [loadingId, setLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleDownloadPDF = async (invoice) => {
    try {
      setLoadingId(invoice.id);
      await invoiceService.downloadPDF(invoice.id);
      showToast(`Invoice #${invoice.invoice_number} PDF downloaded.`, "success");
    } catch (err) {
      showToast("Failed to download invoice PDF.", "danger");
    } finally {
      setLoadingId(null);
    }
  };

  const handleEmailInvoice = async (invoice) => {
    try {
      setLoadingId(invoice.id);
      const res = await invoiceService.emailInvoice(invoice.id);
      showToast(res.message || "Invoice email sent successfully.", "success");
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to send invoice email.", "danger");
    } finally {
      setLoadingId(null);
    }
  };

  const handleMarkPaid = async (invoice) => {
    try {
      setLoadingId(invoice.id);
      await invoiceService.markPaid(invoice.id);
      showToast(`Invoice #${invoice.invoice_number} marked as Paid!`, "success");
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to mark invoice paid.", "danger");
    } finally {
      setLoadingId(null);
    }
  };

  const handleVoidInvoice = async (invoice) => {
    if (!window.confirm("Are you sure you want to void this invoice?")) return;
    try {
      setLoadingId(invoice.id);
      await invoiceService.voidInvoice(invoice.id);
      showToast(`Invoice #${invoice.invoice_number} voided.`, "warning");
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to void invoice.", "danger");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteInvoice = async (invoice) => {
    if (!window.confirm(`Are you sure you want to delete invoice #${invoice.invoice_number}?`)) return;
    try {
      setLoadingId(invoice.id);
      await invoiceService.delete(invoice.id);
      showToast(`Invoice #${invoice.invoice_number} deleted successfully.`, "success");
      if (onRefresh) onRefresh();
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to delete invoice.", "danger");
    } finally {
      setLoadingId(null);
    }
  };

  const totalPages = Math.ceil(invoices.length / itemsPerPage) || 1;
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return invoices.slice(start, start + itemsPerPage);
  }, [invoices, currentPage]);

  return (
    <div className="card border border-slate-200 shadow-sm rounded-4 bg-white overflow-hidden">
      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light micro-text text-uppercase text-muted fw-bold">
            <tr>
              <th className="ps-4">Invoice #</th>
              <th>Plan / Service</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Issued Date</th>
              <th>Due Date</th>
              <th className="text-center pe-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvoices.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-5 text-muted small">
                  No matching invoice statements found.
                </td>
              </tr>
            ) : (
              paginatedInvoices.map((invoice) => {
                const planName =
                  invoice.plan_name ||
                  invoice.billing_cycle?.subscription?.plan?.name ||
                  "Subscription Tier";

                const isPaid = (invoice.status || "").toLowerCase() === "paid";

                return (
                  <tr key={invoice.id}>
                    <td className="ps-4 fw-bold text-dark font-monospace small">{invoice.invoice_number}</td>
                    <td className="fw-medium text-dark small">{planName}</td>
                    <td className="fw-bold text-dark small">{formatCurrency(invoice.total ?? invoice.amount ?? 0)}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(invoice.status)} text-uppercase px-2.5 py-1 micro-text fw-bold`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="small text-secondary">{formatDate(invoice.issued_at || invoice.created_at)}</td>
                    <td className="small text-secondary">{formatDate(invoice.due_date)}</td>
                    <td className="text-center pe-4">
                      <div className="d-flex align-items-center justify-content-center gap-1.5">
                        <button
                          className="btn btn-outline-primary btn-sm rounded-2 p-1.5"
                          title="View Statement Details"
                          onClick={() => onView(invoice)}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          className="btn btn-outline-success btn-sm rounded-2 p-1.5"
                          title="Download PDF Statement"
                          disabled={loadingId === invoice.id}
                          onClick={() => handleDownloadPDF(invoice)}
                        >
                          <Download size={15} />
                        </button>

                        {showAdminActions && (
                          <>
                            <button
                              className="btn btn-outline-info btn-sm rounded-2 p-1.5"
                              title="Email Invoice"
                              disabled={loadingId === invoice.id}
                              onClick={() => handleEmailInvoice(invoice)}
                            >
                              <Mail size={15} />
                            </button>

                            {!isPaid && (
                              <button
                                className="btn btn-outline-success btn-sm rounded-2 p-1.5"
                                title="Mark as Paid"
                                disabled={loadingId === invoice.id}
                                onClick={() => handleMarkPaid(invoice)}
                              >
                                <CheckCircle size={15} />
                              </button>
                            )}

                            {invoice.status !== "void" && (
                              <button
                                className="btn btn-outline-warning btn-sm rounded-2 p-1.5"
                                title="Void Invoice"
                                disabled={loadingId === invoice.id}
                                onClick={() => handleVoidInvoice(invoice)}
                              >
                                <XCircle size={15} />
                              </button>
                            )}

                            <button
                              className="btn btn-outline-danger btn-sm rounded-2 p-1.5"
                              title="Delete Invoice"
                              disabled={loadingId === invoice.id}
                              onClick={() => handleDeleteInvoice(invoice)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
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
          <small className="text-muted micro-text fw-medium">
            Page {currentPage} of {totalPages}
          </small>
          <div className="d-flex gap-1">
            <button
              className="btn btn-outline-secondary btn-sm rounded-2 px-2.5 py-1 micro-text fw-bold"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft size={14} className="me-1" /> Previous
            </button>
            <button
              className="btn btn-outline-secondary btn-sm rounded-2 px-2.5 py-1 micro-text fw-bold"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next <ChevronRight size={14} className="ms-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceTable;