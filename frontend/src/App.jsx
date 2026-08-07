import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// Authentication
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Admin
import Dashboard from "./pages/dashboard/Dashboard";
import Customers from "./pages/customers/Customers";
import Plans from "./pages/plans/Plans";
import Subscriptions from "./pages/subscriptions/Subscriptions";
import Invoices from "./pages/invoices/Invoices";
import Payments from "./pages/payments/Payments";
import Reports from "./pages/reports/Reports";
import Settings from "./pages/settings/Settings";

// Customer
import CustomerLayout from "./components/customers/CustomerLayout";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerPlans from "./pages/customer/CustomerPlans";
import CustomerSubscription from "./pages/customer/CustomerSubscription";
import CustomerInvoices from "./pages/customer/CustomerInvoices";
import CustomerPayments from "./pages/customer/CustomerPayments";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerSupport from "./pages/customer/CustomerSupport";

function App() {

    return (

        <Routes>

            {/* ==========================================
                Root Redirect
            ========================================== */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            {/* ==========================================
                Authentication
            ========================================== */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            <Route
                path="/reset-password"
                element={<ResetPassword />}
            />

            {/* ==========================================
                Admin Portal
            ========================================== */}

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute role="admin">
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/customers"
                element={
                    <ProtectedRoute role="admin">
                        <Customers />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/plans"
                element={
                    <ProtectedRoute role="admin">
                        <Plans />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/subscriptions"
                element={
                    <ProtectedRoute role="admin">
                        <Subscriptions />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/invoices"
                element={
                    <ProtectedRoute role="admin">
                        <Invoices />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/payments"
                element={
                    <ProtectedRoute role="admin">
                        <Payments />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/reports"
                element={
                    <ProtectedRoute role="admin">
                        <Reports />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/settings"
                element={
                    <ProtectedRoute role="admin">
                        <Settings />
                    </ProtectedRoute>
                }
            />

            {/* ==========================================
                Customer Portal
            ========================================== */}

            <Route
                path="/customer/dashboard"
                element={
                    <ProtectedRoute role="customer">
                        <CustomerLayout>
                            <CustomerDashboard />
                        </CustomerLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/customer/plans"
                element={
                    <ProtectedRoute role="customer">
                        <CustomerLayout>
                            <CustomerPlans />
                        </CustomerLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/customer/subscription"
                element={
                    <ProtectedRoute role="customer">
                        <CustomerLayout>
                            <CustomerSubscription />
                        </CustomerLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/customer/invoices"
                element={
                    <ProtectedRoute role="customer">
                        <CustomerLayout>
                            <CustomerInvoices />
                        </CustomerLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/customer/payments"
                element={
                    <ProtectedRoute role="customer">
                        <CustomerLayout>
                            <CustomerPayments />
                        </CustomerLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/customer/profile"
                element={
                    <ProtectedRoute role="customer">
                        <CustomerLayout>
                            <CustomerProfile />
                        </CustomerLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/customer/support"
                element={
                    <ProtectedRoute role="customer">
                        <CustomerLayout>
                            <CustomerSupport />
                        </CustomerLayout>
                    </ProtectedRoute>
                }
            />

            {/* Legacy URL */}

            <Route
                path="/customer/customerplans"
                element={
                    <Navigate
                        to="/customer/plans"
                        replace
                    />
                }
            />

            {/* 404 */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

        </Routes>

    );

}

export default App;