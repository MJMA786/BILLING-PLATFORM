import { useEffect, useState } from "react";

import customerDashboardService from "../../services/customerDashboardService";

function CustomerDashboard() {

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) {

        greeting = "Good Morning";

    } else if (hour < 17) {

        greeting = "Good Afternoon";

    }
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
            await customerDashboardService.getDashboard();

        console.log("Customer Dashboard:", data);

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

        <div className="text-center mt-5">

            <div
                className="spinner-border"
                role="status"
            ></div>

        </div>

    );

}
    return (

        <div className="customer-dashboard">

            {/* Header */}

            <div className="customer-dashboard-header">

                <div>

                    <span className="customer-tag">

                        Customer Dashboard

                    </span>

                    <h1>

                        {greeting} 👋

                    </h1>

                    <p>

                        Welcome back! Here's a quick overview of your account.

                    </p>

                </div>

            </div>

            {/* Summary Cards */}

            <div className="row g-4">

                <div className="col-lg-3 col-md-6">

                    <div className="customer-card">

                        <div className="customer-card-icon bg-primary">

                            <i className="bi bi-box-seam-fill"></i>

                        </div>

                        <h6>Current Plan</h6>

                        <h3>Premium</h3>

                        <small>Monthly Subscription</small>

                    </div>

                </div>

                <div className="col-lg-3 col-md-6">

                    <div className="customer-card">

                        <div className="customer-card-icon bg-success">

                            <i className="bi bi-patch-check-fill"></i>

                        </div>

                        <h6>Status</h6>

                        <h3>Active</h3>

                        <small>Subscription Running</small>

                    </div>

                </div>

                <div className="col-lg-3 col-md-6">

                    <div className="customer-card">

                        <div className="customer-card-icon bg-warning">

                            <i className="bi bi-calendar-check-fill"></i>

                        </div>

                        <h6>Next Billing</h6>

                        <h3>15 Aug</h3>

                        <small>₹499 Due</small>

                    </div>

                </div>

                <div className="col-lg-3 col-md-6">

                    <div className="customer-card">

                        <div className="customer-card-icon bg-danger">

                            <i className="bi bi-receipt-cutoff"></i>

                        </div>

                        <h6>Invoices</h6>

                        <h3>12</h3>

                        <small>Available</small>

                    </div>

                </div>

            </div>

            {/* Main Content */}

            <div className="row mt-4">

                <div className="col-lg-8">

                    <div className="customer-widget">

                        <div className="widget-header">

                            <h5>

                                Subscription Overview

                            </h5>

                        </div>

                        <div className="widget-body">

                            <table className="table">

                                <tbody>

                                    <tr>

                                        <td>Plan</td>

                                        <td>

                                            <strong>

                                                Premium

                                            </strong>

                                        </td>

                                    </tr>

                                    <tr>

                                        <td>Started On</td>

                                        <td>15 July 2026</td>

                                    </tr>

                                    <tr>

                                        <td>Renewal Date</td>

                                        <td>15 August 2026</td>

                                    </tr>

                                    <tr>

                                        <td>Status</td>

                                        <td>

                                            <span className="badge bg-success">

                                                Active

                                            </span>

                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

                <div className="col-lg-4">

                    <div className="customer-widget">

                        <div className="widget-header">

                            <h5>

                                Quick Actions

                            </h5>

                        </div>

                        <div className="d-grid gap-3 p-3">

                            <button className="btn btn-primary">

                                View Subscription

                            </button>

                            <button className="btn btn-outline-primary">

                                Download Invoice

                            </button>

                            <button className="btn btn-outline-secondary">

                                Contact Support

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
    if (error) {

    return (

        <div className="alert alert-danger">

            {error}

        </div>

    );

}

}

export default CustomerDashboard;