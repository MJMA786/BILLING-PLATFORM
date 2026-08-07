import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import customerDashboardService from "../../services/customerDashboardService";
import { formatCurrency, formatDate, getStatusBadgeClass } from "../../utils/formatters";
import {
  Zap,
  Receipt,
  ArrowRight,
  Grid,
  Headphones,
  AlertTriangle,
  Package,
} from "lucide-react";

function CustomerDashboard() {
  const navigate = useNavigate();

  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await customerDashboardService.getDashboard();
      setDashboard(data);
      setError("");
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "450px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Subly Customer Portal...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger d-flex align-items-center rounded-4 shadow-sm mb-0" role="alert">
          <AlertTriangle size={18} className="me-2 flex-shrink-0" />
          <div className="fw-medium">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-dashboard py-2">
      {/* Header */}
      <div className="card border shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1.5 fw-bold micro-text mb-2">
              <Zap size={14} className="me-1" /> Customer Dashboard
            </span>
            <h2 className="fw-bold text-dark mb-1 font-display fs-3">
              {greeting} 👋
            </h2>
            <p className="text-secondary mb-0 small fw-medium">
              Welcome back to Subly! Here is a summary of your active subscription and account.
            </p>
          </div>

          <button
            onClick={() => navigate("/customer/plans")}
            className="btn btn-primary rounded-pill px-4 py-2 fw-bold small shadow-sm"
          >
            Browse Available Plans
          </button>
        </div>
      </div>

      {/* Old Summary Cards Restored */}
      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-3 p-3 bg-primary text-white me-3">
                <i className="bi bi-box-seam-fill fs-4"></i>
              </div>
              <div>
                <span className="text-muted small fw-medium">Current Plan</span>
                <h4 className="fw-bold mb-0 text-dark">
                  {dashboard?.plan?.name || "No Active Plan"}
                </h4>
              </div>
            </div>
            <small className="text-secondary">
              {dashboard?.plan?.billing_interval ? `Billed ${dashboard.plan.billing_interval}` : "Interval: N/A"}
            </small>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-3 p-3 bg-success text-white me-3">
                <i className="bi bi-patch-check-fill fs-4"></i>
              </div>
              <div>
                <span className="text-muted small fw-medium">Status</span>
                <h4 className="fw-bold mb-0 text-capitalize text-dark">
                  {dashboard?.subscription?.status || "Inactive"}
                </h4>
              </div>
            </div>
            <span className={`badge ${getStatusBadgeClass(dashboard?.subscription?.status)} text-uppercase px-2 py-1`}>
              {dashboard?.subscription?.status || "Inactive"}
            </span>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-3 p-3 bg-warning text-dark me-3">
                <i className="bi bi-calendar-check-fill fs-4"></i>
              </div>
              <div>
                <span className="text-muted small fw-medium">Next Billing</span>
                <h4 className="fw-bold mb-0 text-dark">
                  {formatDate(dashboard?.subscription?.renewal_date)}
                </h4>
              </div>
            </div>
            <small className="text-secondary">
              {formatCurrency(dashboard?.pending_amount ?? 0)} Outstanding
            </small>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-3 p-3 bg-info text-white me-3">
                <i className="bi bi-receipt-cutoff fs-4"></i>
              </div>
              <div>
                <span className="text-muted small fw-medium">Invoices</span>
                <h4 className="fw-bold mb-0 text-dark">
                  {dashboard?.invoice_count ?? 0}
                </h4>
              </div>
            </div>
            <small className="text-secondary">Total Invoices Issued</small>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="row g-4">
        <div className="col-lg-8">
          {/* Subscription Overview Card */}
          <div className="card border border-slate-200 shadow-sm rounded-4 mb-4 bg-white">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
              <h5 className="fw-bold text-dark font-display mb-1">Subscription Overview</h5>
              <small className="text-secondary fw-medium">Active plan rates & renewal schedule.</small>
            </div>
            <div className="card-body px-4">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <tbody>
                    <tr>
                      <td className="text-muted small fw-bold py-3">Plan Name</td>
                      <td className="fw-bold text-dark py-3">{dashboard?.plan?.name || "N/A"}</td>
                    </tr>
                    <tr>
                      <td className="text-muted small fw-bold py-3">Plan Price</td>
                      <td className="fw-bold text-primary py-3">{formatCurrency(dashboard?.plan?.price ?? 0)} / {dashboard?.plan?.billing_interval || "month"}</td>
                    </tr>
                    <tr>
                      <td className="text-muted small fw-bold py-3">Renewal Date</td>
                      <td className="fw-bold text-dark py-3">{formatDate(dashboard?.subscription?.renewal_date)}</td>
                    </tr>
                    <tr>
                      <td className="text-muted small fw-bold py-3">Status</td>
                      <td className="py-3">
                        <span className={`badge ${getStatusBadgeClass(dashboard?.subscription?.status)} px-3 py-1.5 text-uppercase micro-text fw-bold`}>
                          {dashboard?.subscription?.status || "Inactive"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Invoices Card */}
          <div className="card border border-slate-200 shadow-sm rounded-4 bg-white">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold text-dark font-display mb-1">Recent Invoices</h5>
                <small className="text-secondary fw-medium">Your latest billing statements.</small>
              </div>
              <button 
                className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fw-bold micro-text d-flex align-items-center gap-1"
                onClick={() => navigate("/customer/invoices")}
              >
                <span>View All</span>
                <ArrowRight size={14} />
              </button>
            </div>
            <div className="card-body px-4">
              {(!dashboard?.recent_invoices || dashboard.recent_invoices.length === 0) ? (
                <p className="text-muted py-3 mb-0 small text-center">No recent invoices available.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="table-light micro-text text-uppercase text-muted fw-bold">
                      <tr>
                        <th>Invoice #</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Issued Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.recent_invoices.map((inv) => (
                        <tr key={inv.id}>
                          <td className="fw-bold text-dark font-monospace small">{inv.invoice_number}</td>
                          <td className="fw-bold text-dark small">{formatCurrency(inv.amount)}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(inv.status)} text-uppercase px-2 py-0.5 micro-text fw-bold`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="small text-secondary">{formatDate(inv.issued_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Quick Actions */}
        <div className="col-lg-4">
          <div className="card border border-slate-200 shadow-sm rounded-4 mb-4 bg-white">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
              <h5 className="fw-bold text-dark font-display mb-1">Quick Actions</h5>
              <small className="text-secondary fw-medium">Direct customer shortcuts.</small>
            </div>
            <div className="card-body p-4 d-grid gap-3">
              <button 
                className="btn btn-primary py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                onClick={() => navigate("/customer/subscription")}
              >
                <Package size={17} /> View My Subscription
              </button>
              
              <button 
                className="btn btn-outline-primary py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                onClick={() => navigate("/customer/invoices")}
              >
                <Receipt size={17} /> View & Pay Invoices
              </button>

              <button 
                className="btn btn-outline-secondary py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 text-dark"
                onClick={() => navigate("/customer/plans")}
              >
                <Grid size={17} /> Browse Available Plans
              </button>

              <button 
                className="btn btn-light text-dark py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 border"
                onClick={() => navigate("/customer/support")}
              >
                <Headphones size={17} /> Customer Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
