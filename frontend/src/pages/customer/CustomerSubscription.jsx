import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import subscriptionService from "../../services/subscriptionService";
import paymentService from "../../services/paymentService";
import PlanCard from "../../components/customerSubscription/PlanCard";
import SubscriptionDetails from "../../components/customerSubscription/SubscriptionDetails";
import UsageCard from "../../components/customerSubscription/UsageCard";
import FeaturesCard from "../../components/customerSubscription/FeaturesCard";
import RecentPayments from "../../components/customerSubscription/RecentPayments";
import SubscriptionActions from "../../components/customerSubscription/SubscriptionActions";
import { useToast } from "../../context/ToastContext";
import { Package, Zap, AlertCircle } from "lucide-react";

function CustomerSubscription() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const subscriptionData = await subscriptionService.getMySubscription();
      setSubscription(subscriptionData);

      try {
        const paymentList = await paymentService.getMyPayments();
        setPayments(paymentList || []);
      } catch (pErr) {
        setPayments([]);
      }
      setError("");
    } catch (err) {
      setError("Failed to load subscription details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    navigate("/customer/plans");
  };

  const handleCancel = async () => {
    if (!subscription?.id) return;
    if (window.confirm("Are you sure you want to cancel your subscription?")) {
      try {
        await subscriptionService.cancel(subscription.id);
        showToast("Subscription cancelled successfully.", "warning");
        fetchData();
      } catch (err) {
        showToast(err.response?.data?.detail || "Failed to cancel subscription.", "danger");
      }
    }
  };

  const handleResume = async () => {
    if (!subscription?.id) return;
    try {
      await subscriptionService.resume(subscription.id);
      showToast("Subscription resumed successfully!", "success");
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to resume subscription.", "danger");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading subscription workspace...</span>
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="container-fluid py-4">
        <div className="card border shadow-sm rounded-4 text-center p-5 bg-white">
          <div className="mb-3 text-warning">
            <AlertCircle size={52} className="mx-auto" />
          </div>
          <h4 className="fw-bold text-dark font-display mb-1">No Active Subscription Found</h4>
          <p className="text-secondary max-w-md mx-auto mb-4 small fw-medium">
            You do not currently have an active subscription plan. Browse our available plans to subscribe now.
          </p>
          <div>
            <button className="btn btn-primary px-4 py-2.5 rounded-3 fw-bold shadow-sm" onClick={() => navigate("/customer/plans")}>
              Browse Available Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-subscription py-2">
      {/* Clean Header */}
      <div className="card border shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1.5 fw-bold micro-text mb-2">
              <Zap size={14} className="me-1" /> Active Subscription Workspace
            </span>
            <h2 className="fw-bold text-dark mb-1 font-display fs-3">
              My Subscription Workspace
            </h2>
            <p className="text-secondary mb-0 small fw-medium">
              View your active plan, billing cycles, features, and subscription management actions.
            </p>
          </div>

          <div>
            <button className="btn btn-outline-primary btn-sm rounded-pill px-3 py-2 fw-bold" onClick={() => navigate("/customer/plans")}>
              <Package size={15} className="me-1.5" /> Change Plan
            </button>
          </div>
        </div>
      </div>

      <PlanCard subscription={subscription} />

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <SubscriptionDetails subscription={subscription} />
        </div>
        <div className="col-lg-6">
          <UsageCard subscription={subscription} />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <FeaturesCard subscription={subscription} />
        </div>
        <div className="col-lg-6">
          <RecentPayments payments={payments} />
        </div>
      </div>

      <div>
        <SubscriptionActions
          subscription={subscription}
          onUpgrade={handleUpgrade}
          onCancel={handleCancel}
          onResume={handleResume}
        />
      </div>
    </div>
  );
}

export default CustomerSubscription;
