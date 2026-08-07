import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import dashboardService from "../../services/dashboardService";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import SubscriptionChart from "../../components/dashboard/SubscriptionChart";
import RecentInvoices from "../../components/dashboard/RecentInvoices";
import NotificationPanel from "../../components/dashboard/NotificationPanel";
import { formatCurrency } from "../../utils/formatters";
import RecentCustomers from "../../components/dashboard/RecentCustomers";
import "../../styles/dashboard.css";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [dashboardData, analyticsData] = await Promise.all([
        dashboardService.getDashboard(),
        dashboardService.getDashboardAnalytics(),
      ]);

      setDashboard(dashboardData);
      setAnalytics(analyticsData);
      setError("");
    } catch (err) {
      setError("Failed to load admin dashboard analytics.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "450px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading Subly Analytics...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="alert alert-danger d-flex align-items-center m-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
        </div>
      </Layout>
    );
  }

  const stats = dashboard?.stats || {};

  return (
    <Layout>
      <div className="dashboard-page py-2">
        <DashboardHeader />

        {/* Primary Executive Stats */}
        <div className="row g-4 mb-4">
          <div className="col-xl-3 col-md-6">
            <StatCard
              title="Customers"
              value={stats.customers || 0}
              icon="bi-people-fill"
              color="primary"
              change={`${stats.active_customers || 0} Active`}
              subtitle="Registered customers"
            />
          </div>

          <div className="col-xl-3 col-md-6">
            <StatCard
              title="Plans"
              value={stats.plans || 0}
              icon="bi-box-seam"
              color="success"
              change={`${stats.active_plans || 0} Active`}
              subtitle="Subscription Tiers"
            />
          </div>

          <div className="col-xl-3 col-md-6">
            <StatCard
              title="Subscriptions"
              value={stats.subscriptions || 0}
              icon="bi-arrow-repeat"
              color="warning"
              change={`${stats.active_subscriptions || 0} Active`}
              subtitle="Running Subscriptions"
            />
          </div>

          <div className="col-xl-3 col-md-6">
            <StatCard
              title="Collected Revenue"
              value={formatCurrency(stats.revenue || 0)}
              icon="bi-currency-rupee"
              color="danger"
              change={`Est. ${formatCurrency(stats.annual_revenue || 0)}/yr`}
              subtitle="Lifetime Receipts"
            />
          </div>
        </div>

        {/* Operational & Billing Pipeline Metrics */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
              <small className="text-muted fw-medium d-block">Outstanding Balance</small>
              <h4 className="fw-bold text-danger mb-0">{formatCurrency(stats.outstanding_amount || 0)}</h4>
              <span className="micro-text text-secondary">{stats.pending_invoices || 0} Open Invoices</span>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
              <small className="text-muted fw-medium d-block">Total Invoices</small>
              <h4 className="fw-bold text-dark mb-0">{stats.total_invoices || 0}</h4>
              <span className="micro-text text-success">{stats.paid_invoices || 0} Paid</span>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
              <small className="text-muted fw-medium d-block">Successful Payments</small>
              <h4 className="fw-bold text-success mb-0">{stats.successful_payments || 0}</h4>
              <span className="micro-text text-secondary">Settled Transactions</span>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
              <small className="text-muted fw-medium d-block">Failed Payments</small>
              <h4 className="fw-bold text-warning mb-0">{stats.failed_payments || 0}</h4>
              <span className="micro-text text-muted">Retries Pending</span>
            </div>
          </div>
        </div>

        {/* Revenue & Subscription Charts */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <RevenueChart data={analytics?.monthly_revenue || []} />
          </div>

          <div className="col-lg-4">
            <SubscriptionChart data={analytics?.subscription_distribution || []} />
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-12">
            <RecentCustomers
              customers={dashboard?.recent_customers || []}
            />
          </div>
        </div>
        
        {/* Recent Invoices & Notification Panel */}
        <div className="row g-4">
          <div className="col-lg-8">
            <RecentInvoices invoices={dashboard?.recent_invoices || []} />
          </div>

          <div className="col-lg-4">
            <NotificationPanel notifications={dashboard?.notifications || []} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;