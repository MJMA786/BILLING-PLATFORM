import { useEffect, useMemo, useState } from "react";
import invoiceService from "../../services/invoiceService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { Receipt, Search, CheckCircle2, Clock, Zap, AlertTriangle, X, RotateCcw, Download } from "lucide-react";
import MyInvoiceTable from "../../components/invoices/InvoiceTable";
import MyInvoiceViewModal from "../../components/invoices/InvoiceViewModal";
import PaymentGatewayModal from "../../components/common/PaymentGatewayModal";
import { useToast } from "../../context/ToastContext";

function CustomerInvoices() {
  const { showToast } = useToast();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Gateway Modal State
  const [invoiceToPay, setInvoiceToPay] = useState(null);
  const [showGateway, setShowGateway] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getMyInvoices();
      setInvoices(data || []);
      setError("");
    } catch (err) {
      setError("Failed to load your invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Multi-field Smart Filter Logic
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const invNum = String(inv.invoice_number || "");
      const planName = String(
        inv.plan_name ||
        inv.billing_cycle?.subscription?.plan?.name ||
        ""
      );
      const amountStr = String(inv.total ?? inv.amount ?? "");
      const statusStr = String(inv.status || "").toLowerCase();
      const issueDateStr = formatDate(inv.issued_at || inv.created_at).toLowerCase();

      const query = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !query ||
        invNum.toLowerCase().includes(query) ||
        planName.toLowerCase().includes(query) ||
        amountStr.toLowerCase().includes(query) ||
        statusStr.includes(query) ||
        issueDateStr.includes(query);

      const matchesStatus =
        statusFilter === "All" || statusStr === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const paidInvoices = invoices.filter((invoice) => (invoice.status || "").toLowerCase() === "paid");
  const outstandingInvoices = invoices.filter((invoice) => (invoice.status || "").toLowerCase() !== "paid");
  const outstandingAmount = outstandingInvoices.reduce(
    (total, invoice) => total + Number(invoice.total || invoice.amount || 0),
    0
  );

  const isFiltered = searchTerm.trim() !== "" || statusFilter !== "All";

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  const handleExportCSV = () => {
    if (!filteredInvoices.length) {
      showToast("No invoice statements to export.", "warning");
      return;
    }
    const headers = ["Invoice Number", "Plan Name", "Issued Date", "Due Date", "Total Amount", "Status"];
    const rows = filteredInvoices.map((inv) => [
      inv.invoice_number || `INV-${inv.id}`,
      inv.plan_name || inv.billing_cycle?.subscription?.plan?.name || "Subscription Tier",
      formatDate(inv.issued_at || inv.created_at),
      formatDate(inv.due_date),
      inv.total ?? inv.amount ?? 0,
      inv.status || "open",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customer_invoices_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Invoice history exported to CSV!", "success");
  };

  const handlePaymentSuccess = () => {
    showToast("Invoice payment completed successfully! 🎉", "success");
    fetchInvoices();
  };

  return (
    <div className="customer-invoices py-2">
      {/* Header */}
      <div className="card border shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1.5 fw-bold micro-text mb-2">
              <Zap size={14} className="me-1" /> Customer Invoices Workspace
            </span>
            <h2 className="fw-bold text-dark mb-1 font-display fs-3">
              My Invoices & Statements
            </h2>
            <p className="text-secondary mb-0 small fw-medium">
              View, track, pay open balances, and download all your subscription PDF receipts.
            </p>
          </div>

          <div className="text-end bg-light p-3 rounded-4 border border-slate-200">
            <small className="text-muted micro-text fw-bold text-uppercase d-block mb-0.5">Total Statements</small>
            <h4 className="fw-bold mb-0 text-primary font-display">{invoices.length}</h4>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center rounded-4 shadow-sm mb-4" role="alert">
          <AlertTriangle size={18} className="me-2 flex-shrink-0" />
          <div className="fw-medium">{error}</div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="card border border-slate-200 shadow-sm rounded-4 h-100 bg-white">
            <div className="card-body d-flex align-items-center p-3.5">
              <div className="bg-primary-subtle text-primary rounded-3 p-3 me-3 d-flex align-items-center justify-content-center">
                <Receipt size={22} />
              </div>
              <div>
                <small className="text-muted micro-text fw-bold text-uppercase d-block mb-0.5">Total Issued</small>
                <h4 className="fw-bold mb-0 text-dark font-display">{invoices.length}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border border-slate-200 shadow-sm rounded-4 h-100 bg-white">
            <div className="card-body d-flex align-items-center p-3.5">
              <div className="bg-success-subtle text-success rounded-3 p-3 me-3 d-flex align-items-center justify-content-center">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <small className="text-muted micro-text fw-bold text-uppercase d-block mb-0.5">Paid Invoices</small>
                <h4 className="fw-bold mb-0 text-dark font-display">{paidInvoices.length}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border border-slate-200 shadow-sm rounded-4 h-100 bg-white">
            <div className="card-body d-flex align-items-center p-3.5">
              <div className="bg-warning-subtle text-warning rounded-3 p-3 me-3 d-flex align-items-center justify-content-center">
                <Clock size={22} />
              </div>
              <div>
                <small className="text-muted micro-text fw-bold text-uppercase d-block mb-0.5">Outstanding Amount</small>
                <h4 className="fw-bold mb-0 text-danger font-display">{formatCurrency(outstandingAmount)}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search & Filter Toolbar */}
      <div className="card border border-slate-200 shadow-sm rounded-4 mb-4 bg-white">
        <div className="card-body p-3">
          <div className="row g-3 align-items-center">
            {/* Search Input Box */}
            <div className="col-lg-6 col-md-7">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted ps-3">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 border-end-0 ps-2 shadow-none small font-display"
                  placeholder="Search by invoice #, plan name, status, or amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="input-group-text bg-white border-start-0 text-muted cursor-pointer pe-3"
                    onClick={() => setSearchTerm("")}
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="col-lg-3 col-md-5">
              <select
                className="form-select shadow-none small fw-medium"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="open">Open / Unpaid</option>
                <option value="draft">Draft</option>
                <option value="void">Void</option>
              </select>
            </div>

            {/* Toolbar Action Buttons */}
            <div className="col-lg-3 d-flex justify-content-end gap-2">
              {isFiltered && (
                <button
                  className="btn btn-outline-secondary btn-sm rounded-3 px-2.5 py-2 micro-text fw-bold d-flex align-items-center gap-1"
                  onClick={handleResetFilters}
                  title="Reset Filters"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              )}

              <button
                className="btn btn-primary btn-sm rounded-3 px-3 py-2 micro-text fw-bold d-flex align-items-center gap-1.5 shadow-sm"
                onClick={handleExportCSV}
                title="Export CSV Statements"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <MyInvoiceTable
        invoices={filteredInvoices}
        loading={loading}
        onView={setSelectedInvoice}
      />

      {/* View Modal */}
      <MyInvoiceViewModal
        show={selectedInvoice !== null}
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onPay={(inv) => {
          setInvoiceToPay(inv);
          setShowGateway(true);
        }}
      />

      {/* Payment Gateway Modal */}
      <PaymentGatewayModal
        show={showGateway}
        invoice={invoiceToPay}
        onClose={() => {
          setShowGateway(false);
          setInvoiceToPay(null);
        }}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

export default CustomerInvoices;
