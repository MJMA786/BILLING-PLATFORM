import { useEffect, useState } from "react";
import { CreditCard, Clock, XCircle, Calendar, Zap, AlertTriangle } from "lucide-react";
import paymentService from "../../services/paymentService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import PaymentStats from "../../components/customerPayments/PaymentStats";
import PaymentToolbar from "../../components/customerPayments/PaymentToolbar";
import PaymentTable from "../../components/customerPayments/PaymentTable";
import PaymentDetailsDrawer from "../../components/customerPayments/PaymentDetailsDrawer";
import { useToast } from "../../context/ToastContext";

export default function CustomerPayments() {
  const { showToast } = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getMyPayments();
      setPayments(data || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch payment history.");
    } finally {
      setLoading(false);
    }
  };

  const totalPaid = payments
    .filter((p) => String(p.status).toLowerCase() === "succeeded" || String(p.status).toLowerCase() === "paid")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const pendingCount = payments.filter(
    (p) => String(p.status).toLowerCase() === "pending"
  ).length;

  const failedCount = payments.filter(
    (p) => String(p.status).toLowerCase() === "failed"
  ).length;

  const stats = [
    {
      title: "Total Paid",
      value: formatCurrency(totalPaid),
      subtitle: "Lifetime payments",
      icon: CreditCard,
      color: "success",
    },
    {
      title: "Pending",
      value: `${pendingCount} Payments`,
      subtitle: "Awaiting settlement",
      icon: Clock,
      color: "warning",
    },
    {
      title: "Failed",
      value: `${failedCount} Payments`,
      subtitle: "Failed attempts",
      icon: XCircle,
      color: "danger",
    },
    {
      title: "Total Transactions",
      value: `${payments.length}`,
      subtitle: "Recorded receipts",
      icon: Calendar,
      color: "primary",
    },
  ];

  // Smart Multi-field Filter Logic
  const filteredPayments = payments.filter((payment) => {
    const invNum = String(
      payment.invoice?.invoice_number ||
      payment.invoice_number ||
      (typeof payment.invoice === "string" ? payment.invoice : "") ||
      ""
    );
    const txnId = String(
      payment.gateway_reference ||
      payment.transaction_id ||
      payment.transactionId ||
      ""
    );
    const amountStr = String(payment.amount || "");
    const methodStr = String(payment.payment_method || payment.method || "card").toLowerCase();
    const statusStr = String(payment.status || "").toLowerCase();
    const dateStr = formatDate(payment.attempted_at || payment.date, true).toLowerCase();

    const query = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !query ||
      invNum.toLowerCase().includes(query) ||
      txnId.toLowerCase().includes(query) ||
      amountStr.toLowerCase().includes(query) ||
      methodStr.includes(query) ||
      statusStr.includes(query) ||
      dateStr.includes(query);

    const matchesStatus =
      statusFilter === "All" || statusStr === statusFilter.toLowerCase();

    const matchesMethod =
      methodFilter === "All" || methodStr.includes(methodFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setMethodFilter("All");
  };

  const handleExportCSV = () => {
    if (!filteredPayments.length) {
      showToast("No payment records to export.", "warning");
      return;
    }
    const headers = ["Invoice Number", "Gateway Reference", "Attempted Date", "Payment Method", "Amount", "Status"];
    const rows = filteredPayments.map((p) => [
      p.invoice?.invoice_number || p.invoice_number || `INV-${p.invoice_id}`,
      p.gateway_reference || p.transaction_id || "-",
      formatDate(p.attempted_at || p.created_at, true),
      p.payment_method || "Card",
      p.amount || 0,
      p.status || "succeeded",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payment_history_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Payment history exported to CSV!", "success");
  };

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setShowDrawer(true);
  };

  return (
    <div className="customer-payments py-2">
      {/* Clean Header */}
      <div className="card border shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1.5 fw-bold micro-text mb-2">
              <Zap size={14} className="me-1" /> Customer Payment Ledger
            </span>
            <h2 className="fw-bold text-dark mb-1 font-display fs-3">
              My Payment Receipts & Ledger
            </h2>
            <p className="text-secondary mb-0 small fw-medium">
              Track transaction receipts, settlement statuses, and gateway reference codes.
            </p>
          </div>

          <div className="text-end bg-light p-3 rounded-4 border border-slate-200">
            <small className="text-muted micro-text fw-bold text-uppercase d-block mb-0.5">Total Transactions</small>
            <h4 className="fw-bold mb-0 text-primary font-display">{payments.length}</h4>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center rounded-4 shadow-sm mb-4" role="alert">
          <AlertTriangle size={18} className="me-2 flex-shrink-0" />
          <div className="fw-medium">{error}</div>
        </div>
      )}

      {/* Stats */}
      <div className="row g-4 mb-4">
        {stats.map((item, index) => (
          <div className="col-xl-3 col-md-6" key={index}>
            <PaymentStats {...item} />
          </div>
        ))}
      </div>

      {/* Smart Toolbar */}
      <PaymentToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        methodFilter={methodFilter}
        setMethodFilter={setMethodFilter}
        onResetFilters={handleResetFilters}
        onExportCSV={handleExportCSV}
      />

      {/* Table */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "300px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading payments...</span>
          </div>
        </div>
      ) : (
        <PaymentTable payments={filteredPayments} onView={handleView} />
      )}

      {/* Drawer */}
      <PaymentDetailsDrawer
        show={showDrawer}
        payment={selectedPayment}
        onClose={() => {
          setShowDrawer(false);
          setSelectedPayment(null);
        }}
      />
    </div>
  );
}
