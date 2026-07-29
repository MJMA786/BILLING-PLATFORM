import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import Customers from "./pages/customers/Customers";
import Plans from "./pages/plans/Plans";
import Subscriptions from "./pages/subscriptions/Subscriptions";
import Invoices from "./pages/invoices/Invoices";
import Payments from "./pages/payments/Payments";
import CustomerDashboard from "./pages/customers/CustomerDashboard";
import CustomerLayout from "./components/customers/CustomerLayout";
import Support from "./pages/customers/Support";
import Profile from "./pages/customers/Profile";
import MyPayments from "./pages/customers/MyPayments";
import MySubscriptions from "./pages/customers/MySubscription";
import MyInvoices from "./pages/customers/MyInvoices";
import CustomerPlans from "./pages/customers/CustomerPlans";


function App() {
  return (
    <Routes>
      {/* Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin Dashboard */}
      
      <Route path="/dashboard" element={ <ProtectedRoute><Dashboard /></ProtectedRoute> } />
      <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute> } />
      <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute> } />
      <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute> } />
      <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute> } />
      <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute> } />

      {/* Customer Dashboard */}

      <Route path="/customer/dashboard" element={<ProtectedRoute><CustomerLayout><CustomerDashboard /></CustomerLayout></ProtectedRoute>} />
      <Route path="/customer/support" element={<ProtectedRoute><CustomerLayout><Support /></CustomerLayout></ProtectedRoute>} />
      <Route path="/customer/profile" element={<ProtectedRoute><CustomerLayout><Profile /></CustomerLayout></ProtectedRoute>} />
      <Route path="/customer/payments" element={<ProtectedRoute><CustomerLayout><MyPayments /></CustomerLayout></ProtectedRoute>} />
      <Route path="/customer/subscription" element={<ProtectedRoute><CustomerLayout><MySubscriptions /></CustomerLayout></ProtectedRoute>} />
      <Route path="/customer/invoices" element={<ProtectedRoute><CustomerLayout><MyInvoices /></CustomerLayout></ProtectedRoute>} />
      <Route path="/customer/customerplans" element={<ProtectedRoute><CustomerLayout><CustomerPlans /></CustomerLayout></ProtectedRoute>} />
      
    </Routes>
  );
}

export default App;