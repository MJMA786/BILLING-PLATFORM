import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import PageHeader from "../../components/common/PageHeader";
import customerService from "../../services/customerService";
import subscriptionService from "../../services/subscriptionService";
import invoiceService from "../../services/invoiceService";
import paymentService from "../../services/paymentService";
import { formatCurrency, formatDate, getStatusBadgeClass } from "../../utils/formatters";
import { Download, FileText, BarChart3, Users, Receipt, CreditCard, Package } from "lucide-react";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("revenue");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [customers, setCustomers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [cData, sData, iData, pData] = await Promise.all([
        customerService.getAllCustomers().catch(() => []),
        subscriptionService.getAllSubscriptions().catch(() => []),
        invoiceService.getAll().catch(() => []),
        paymentService.getAll().catch(() => []),
      ]);

      setCustomers(cData || []);
      setSubscriptions(sData || []);
      setInvoices(iData || []);
      setPayments(pData || []);
      setError("");
    } catch (err) {
      setError("Failed to load reporting data.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (activeTab === "customers") {
      const exportData = customers.map((c) => ({
        ID: c.id,
        "Customer Name": c.company_name || c.contact_person || "Valued Customer",
        "Billing Email": c.billing_email || c.user?.email || "-",
        Phone: c.phone || "-",
        Country: c.country || "India",
        "Created At": c.created_at ? formatDate(c.created_at) : "-",
      }));
      exportCSV(exportData, "Subly_Customers_Report");
    } else if (activeTab === "subscriptions") {
      const exportData = subscriptions.map((s) => ({
        ID: s.id,
        Customer: s.customer?.company_name || s.customer?.contact_person || `Customer #${s.customer_id}`,
        Plan: s.plan?.name || `Plan #${s.plan_id}`,
        Status: s.status,
        "Start Date": s.current_period_start ? formatDate(s.current_period_start) : "-",
        "End Date": s.current_period_end ? formatDate(s.current_period_end) : "-",
      }));
      exportCSV(exportData, "Subly_Subscriptions_Report");
    } else if (activeTab === "invoices") {
      const exportData = invoices.map((inv) => ({
        "Invoice Number": inv.invoice_number,
        Customer: inv.customer_name || inv.billing_cycle?.subscription?.customer?.company_name || "-",
        Plan: inv.plan_name || inv.billing_cycle?.subscription?.plan?.name || "-",
        Subtotal: inv.subtotal,
        Tax: inv.tax_amount,
        Total: inv.total,
        Status: inv.status,
        "Issued Date": inv.issued_at ? formatDate(inv.issued_at) : "-",
      }));
      exportCSV(exportData, "Subly_Invoices_Report");
    } else {
      const exportData = payments.map((p) => ({
        "Payment ID": p.id,
        "Gateway Ref": p.gateway_reference || `PAY-${p.id}`,
        "Invoice Ref": p.invoice?.invoice_number || `INV-${p.invoice_id}`,
        Customer: p.customer_name || p.invoice?.customer?.company_name || "-",
        Amount: p.amount,
        Status: p.status,
        "Payment Method": p.payment_method || "Manual",
        "Attempt Date": p.attempted_at ? formatDate(p.attempted_at, true) : "-",
      }));
      exportCSV(exportData, `Subly_${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}_Report`);
    }
  };

  const exportCSV = (dataArray, filename) => {
    if (!dataArray || dataArray.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = Object.keys(dataArray[0]);
    const csvRows = [];
    csvRows.push(headers.join(","));

    dataArray.forEach((row) => {
      const values = headers.map((header) => {
        const val = row[header] ?? "";
        const escaped = ("" + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const totalRevenue = payments
    .filter((p) => (p.status || "").toLowerCase() === "succeeded" || (p.status || "").toLowerCase() === "paid")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const totalOutstanding = invoices
    .filter((i) => (i.status || "").toLowerCase() !== "paid" && (i.status || "").toLowerCase() !== "void")
    .reduce((sum, i) => sum + Number(i.total || 0), 0);

  return (
    <Layout>
      <div className="container-fluid py-2">
        <PageHeader
          tag="Analytics & Reports"
          title="Enterprise Reports"
          description="Generate, filter, and export comprehensive business, revenue, customer, and billing reports."
        />

        {error && (
          <div className="alert alert-danger mb-4 d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{error}</div>
          </div>
        )}

        {/* Summary Metric Cards */}
        <div className="row g-4 mb-4">
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
              <div className="d-flex align-items-center">
                <div className="bg-primary-subtle text-primary p-3 rounded-3 me-3">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <small className="text-muted fw-medium d-block">Collected Revenue</small>
                  <h4 className="fw-bold mb-0 text-dark">{formatCurrency(totalRevenue)}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
              <div className="d-flex align-items-center">
                <div className="bg-success-subtle text-success p-3 rounded-3 me-3">
                  <Users size={24} />
                </div>
                <div>
                  <small className="text-muted fw-medium d-block">Total Customers</small>
                  <h4 className="fw-bold mb-0 text-dark">{customers.length}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
              <div className="d-flex align-items-center">
                <div className="bg-info-subtle text-info p-3 rounded-3 me-3">
                  <Package size={24} />
                </div>
                <div>
                  <small className="text-muted fw-medium d-block">Active Subscriptions</small>
                  <h4 className="fw-bold mb-0 text-dark">
                    {subscriptions.filter((s) => (s.status || "").toLowerCase() === "active").length}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
              <div className="d-flex align-items-center">
                <div className="bg-warning-subtle text-warning p-3 rounded-3 me-3">
                  <Receipt size={24} />
                </div>
                <div>
                  <small className="text-muted fw-medium d-block">Outstanding Invoices</small>
                  <h4 className="fw-bold mb-0 text-dark">{formatCurrency(totalOutstanding)}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-2">
            <ul className="nav nav-pills nav-fill gap-2">
              <li className="nav-item">
                <button
                  className={`nav-link py-2.5 rounded-3 fw-semibold ${activeTab === "revenue" ? "active bg-primary" : "text-dark"}`}
                  onClick={() => setActiveTab("revenue")}
                >
                  <BarChart3 size={16} className="me-2" /> Revenue Report
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link py-2.5 rounded-3 fw-semibold ${activeTab === "customers" ? "active bg-primary" : "text-dark"}`}
                  onClick={() => setActiveTab("customers")}
                >
                  <Users size={16} className="me-2" /> Customer Report
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link py-2.5 rounded-3 fw-semibold ${activeTab === "subscriptions" ? "active bg-primary" : "text-dark"}`}
                  onClick={() => setActiveTab("subscriptions")}
                >
                  <Package size={16} className="me-2" /> Subscription Report
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link py-2.5 rounded-3 fw-semibold ${activeTab === "invoices" ? "active bg-primary" : "text-dark"}`}
                  onClick={() => setActiveTab("invoices")}
                >
                  <Receipt size={16} className="me-2" /> Invoice Report
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link py-2.5 rounded-3 fw-semibold ${activeTab === "payments" ? "active bg-primary" : "text-dark"}`}
                  onClick={() => setActiveTab("payments")}
                >
                  <CreditCard size={16} className="me-2" /> Payment Report
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Tab Content Display */}
        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Generating report...</span>
            </div>
          </div>
        ) : (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h5 className="fw-bold mb-0 text-dark text-capitalize">{activeTab} Report Data</h5>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary btn-sm rounded-3 fw-semibold px-3"
                  onClick={handleExportCSV}
                >
                  <Download size={14} className="me-1.5" /> Export CSV
                </button>
              </div>
            </div>

            <div className="table-responsive">
              {activeTab === "revenue" && (
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Transaction ID</th>
                      <th>Customer Name</th>
                      <th>Invoice Ref</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Attempt Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => {
                      const custName = p.customer_name || p.invoice?.customer?.company_name || p.invoice?.customer?.contact_person || "-";
                      return (
                        <tr key={p.id}>
                          <td className="fw-semibold">{p.gateway_reference || `PAY-${p.id}`}</td>
                          <td className="fw-bold text-dark">{custName}</td>
                          <td>{p.invoice?.invoice_number || `INV-${p.invoice_id}`}</td>
                          <td className="fw-bold text-success">{formatCurrency(p.amount)}</td>
                          <td className="text-capitalize small">{p.payment_method || "Manual"}</td>
                          <td><span className={`badge ${getStatusBadgeClass(p.status)}`}>{p.status}</span></td>
                          <td>{formatDate(p.attempted_at, true)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {activeTab === "customers" && (
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Customer Name</th>
                      <th>Billing Email</th>
                      <th>Billing Country</th>
                      <th>Joined Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => {
                      const cName = c.company_name || c.contact_person || "Valued Customer";
                      const cEmail = c.billing_email || c.user?.email || "-";
                      return (
                        <tr key={c.id}>
                          <td className="fw-semibold">#{c.id}</td>
                          <td className="fw-bold text-dark">{cName}</td>
                          <td>{cEmail}</td>
                          <td>{c.country || "India"}</td>
                          <td>{formatDate(c.created_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {activeTab === "subscriptions" && (
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((s) => {
                      const cName = s.customer?.company_name || s.customer?.contact_person || `Customer #${s.customer_id}`;
                      return (
                        <tr key={s.id}>
                          <td className="fw-semibold">#{s.id}</td>
                          <td className="fw-bold text-dark">{cName}</td>
                          <td>{s.plan?.name || `Plan #${s.plan_id}`}</td>
                          <td><span className={`badge ${getStatusBadgeClass(s.status)}`}>{s.status}</span></td>
                          <td>{formatDate(s.current_period_start)}</td>
                          <td>{formatDate(s.current_period_end)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {activeTab === "invoices" && (
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Invoice #</th>
                      <th>Customer</th>
                      <th>Plan</th>
                      <th>Subtotal</th>
                      <th>Tax</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Issued Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => {
                      const custName = inv.customer_name || inv.billing_cycle?.subscription?.customer?.company_name || inv.billing_cycle?.subscription?.customer?.contact_person || "-";
                      const planName = inv.plan_name || inv.billing_cycle?.subscription?.plan?.name || "-";
                      return (
                        <tr key={inv.id}>
                          <td className="fw-semibold">{inv.invoice_number}</td>
                          <td className="fw-bold text-dark">{custName}</td>
                          <td>{planName}</td>
                          <td>{formatCurrency(inv.subtotal)}</td>
                          <td>{formatCurrency(inv.tax_amount)}</td>
                          <td className="fw-bold text-dark">{formatCurrency(inv.total)}</td>
                          <td><span className={`badge ${getStatusBadgeClass(inv.status)}`}>{inv.status}</span></td>
                          <td>{formatDate(inv.issued_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {activeTab === "payments" && (
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Payment ID</th>
                      <th>Customer Name</th>
                      <th>Invoice #</th>
                      <th>Gateway Reference</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => {
                      const custName = p.customer_name || p.invoice?.customer?.company_name || p.invoice?.customer?.contact_person || "-";
                      return (
                        <tr key={p.id}>
                          <td className="fw-semibold">#{p.id}</td>
                          <td className="fw-bold text-dark">{custName}</td>
                          <td>{p.invoice?.invoice_number || `INV-${p.invoice_id}`}</td>
                          <td className="font-monospace small">{p.gateway_reference || "-"}</td>
                          <td className="fw-bold text-dark">{formatCurrency(p.amount)}</td>
                          <td><span className={`badge ${getStatusBadgeClass(p.status)}`}>{p.status}</span></td>
                          <td>{formatDate(p.attempted_at, true)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}