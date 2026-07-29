import { useEffect, useState } from "react";

import Layout from "../../components/Layout";


import dashboardService from "../../services/dashboardService";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import RevenueChart from "../../components/dashboard/RevenueChart";
import SubscriptionChart from "../../components/dashboard/SubscriptionChart";
import RecentInvoices from "../../components/dashboard/RecentInvoices";
import NotificationPanel from "../../components/dashboard/NotificationPanel";
import "../../styles/dashboard.css";


function Dashboard() {

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      setLoading(true);

      const data =
        await dashboardService.getDashboard();

      setDashboard(data);

      setError("");

    }

    catch (err) {

      console.error(err);

      setError("Failed to load dashboard.");

    }

    finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      
<Layout>

    <div className="dashboard-page">

        {/* Dashboard */}

    </div>

</Layout>

    );

  }

  if (error) {

    return (

      <Layout>

        <div className="alert alert-danger">

          <i className="bi bi-exclamation-triangle-fill me-2"></i>

          {error}

        </div>

      </Layout>

    );

  }

  return (

    <Layout>

      {/* ===========================
          PAGE HEADER
      ============================ */}

      <DashboardHeader />

      {/* ===========================
          STATISTICS
      ============================ */}
      <div className="row g-4">

    <div className="col-xl-3 col-md-6">
        <StatCard
            title="Customers"
            value={dashboard.stats.customers}
            icon="bi-people-fill"
            color="primary"
            change="+12%"
            subtitle="Registered customers"
        />
    </div>

    <div className="col-xl-3 col-md-6">
        <StatCard
            title="Plans"
            value={dashboard.stats.plans}
            icon="bi-box-seam"
            color="success"
            change="+5%"
            subtitle="Active plans"
        />
    </div>

    <div className="col-xl-3 col-md-6">
        <StatCard
            title="Subscriptions"
            value={dashboard.stats.subscriptions}
            icon="bi-arrow-repeat"
            color="warning"
            change="+9%"
            subtitle="Running subscriptions"
        />
    </div>

    <div className="col-xl-3 col-md-6">
        <StatCard
            title="Revenue"
            value={`₹${Number(dashboard.stats.revenue).toLocaleString("en-IN")}`}
            icon="bi bi-currency-rupee"
            color="danger"
            change="+18%"
            subtitle="Total revenue"
        />
    </div>

</div>

          {/* ===========================
          RECENT INVOICES
      ============================ */}
<div className="row mt-5">

    <div className="col-lg-8 mb-4">

        <RevenueChart/>

    </div>

    <div className="col-lg-4 mb-4">

        <SubscriptionChart/>

    </div>

</div>
    

      {/* ===========================
          NOTIFICATIONS
      ============================ */}
<div className="row mt-4">

    <div className="col-lg-8">

        <RecentInvoices

            invoices={dashboard.recent_invoices}

        />

    </div>

    <div className="col-lg-4">

        <NotificationPanel

            notifications={dashboard.notifications}

        />

    </div>

</div>


  

  </Layout>

);

}

export default Dashboard;