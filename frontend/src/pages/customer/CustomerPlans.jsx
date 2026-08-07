import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import planService from "../../services/planService";
import { getCurrentUser } from "../../services/authService";
import { formatCurrency } from "../../utils/formatters";
import { useToast } from "../../context/ToastContext";
import { CreditCard, Check, Sparkles, Zap, ArrowRight } from "lucide-react";
import PaymentGatewayModal from "../../components/common/PaymentGatewayModal";

function CustomerPlans() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Checkout Modal State
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    fetchPlans();
    fetchCurrentUser();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await planService.getAvailablePlans();
      setPlans(data || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch available plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error(err);
    }
  };

  const choosePlan = (plan) => {
    setSelectedPlanForCheckout(plan);
    setShowCheckoutModal(true);
  };

  const handlePaymentSuccess = (result) => {
    showToast(`Plan ${result.plan_name} purchased and activated successfully! 🎉`, "success");
    setTimeout(() => {
      navigate("/customer/subscription");
    }, 1200);
  };

  // Helper to extract feature array
  const getFeaturesList = (plan) => {
    if (!plan.features) {
      return [
        "Full Platform Access & Features",
        "Automated PDF Invoices & Receipts",
        "Self-Service Customer Dashboard",
        "24/7 Priority Support",
      ];
    }
    if (Array.isArray(plan.features)) return plan.features;
    if (typeof plan.features === "object") {
      return Object.entries(plan.features).map(
        ([k, v]) => `${k.replace(/_/g, " ").toUpperCase()}: ${v}`
      );
    }
    return [String(plan.features)];
  };

  return (
    <div className="customer-plans py-2">
      {/* Simple Clean Header */}
      <div className="card border shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1.5 fw-bold micro-text mb-2">
              <Zap size={14} className="me-1" /> Available Subscription Plans
            </span>
            <h2 className="fw-bold text-dark mb-1 font-display fs-3">
              Choose Your Subscription Plan
            </h2>
            <p className="text-secondary mb-0 small fw-medium">
              Select a plan below to launch your subscription with instant automated checkout & email confirmation.
            </p>
          </div>

          <div>
            <span className="badge bg-light text-dark border border-slate-200 px-3 py-2 rounded-pill fw-bold small shadow-none">
              <CreditCard size={15} className="me-1.5 text-primary" />
              {plans.length} Active Plans Available
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center rounded-4 shadow-sm mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div className="fw-medium">{error}</div>
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "300px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading plans...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4 justify-content-center">
          {plans.map((plan, idx) => {
            const isPopular = idx === 1 || plan.name?.toLowerCase().includes("premium") || plan.name?.toLowerCase().includes("pro");
            const features = getFeaturesList(plan);

            return (
              <div className="col-xl-4 col-lg-6" key={plan.id}>
                <div className={`card border shadow-sm rounded-4 h-100 position-relative bg-white card-hover ${isPopular ? "border-primary border-2" : "border-slate-200"}`}>
                  {isPopular && (
                    <div className="position-absolute top-0 start-50 translate-middle">
                      <span className="badge bg-primary text-white rounded-pill px-3 py-1 micro-text fw-bold shadow-sm d-flex align-items-center gap-1">
                        <Sparkles size={12} /> POPULAR TIER
                      </span>
                    </div>
                  )}

                  <div className="card-body p-4 d-flex flex-column">
                    {/* Header */}
                    <div className="text-center mt-2 mb-3">
                      <div className={`p-3 rounded-circle d-inline-flex mb-2.5 ${isPopular ? "bg-primary text-white shadow-sm" : "bg-primary-subtle text-primary"}`}>
                        <CreditCard size={26} />
                      </div>
                      <h4 className="fw-bold text-dark font-display mb-1">{plan.name}</h4>
                      
                      <div className="d-flex align-items-baseline justify-content-center gap-1 my-2">
                        <h2 className="fw-bold text-primary mb-0 font-display fs-1">
                          {formatCurrency(plan.price)}
                        </h2>
                        <span className="text-secondary fw-semibold small text-uppercase">
                          / {plan.billing_interval || plan.interval || "month"}
                        </span>
                      </div>
                    </div>

                    <div className="bg-light rounded-pill px-3 py-1.5 mb-3 text-center border border-slate-200">
                      <small className="text-dark fw-bold micro-text">
                        ⚡ Billed {plan.billing_interval?.toLowerCase() || plan.interval?.toLowerCase() || "month"}ly
                      </small>
                    </div>

                    <p className="text-dark small mb-3 text-center fw-normal">
                      {plan.description || "Comprehensive feature tier suitable for your business growth."}
                    </p>

                    <hr className="my-2 opacity-25" />

                    {/* Features List */}
                    <div className="my-3 flex-grow-1">
                      <h6 className="fw-bold text-uppercase micro-text text-primary mb-2.5 tracking-wider">Included Features:</h6>
                      <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                        {features.map((feat, fIdx) => (
                          <li key={fIdx} className="d-flex align-items-start gap-2.5">
                            <span className="p-1 bg-success-subtle text-success rounded-circle mt-0.5 flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: 18, height: 18 }}>
                              <Check size={12} />
                            </span>
                            <span className="fw-semibold text-dark small">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      className={`btn w-100 py-2.5 rounded-3 fw-bold mt-auto d-flex align-items-center justify-content-center gap-2 shadow-sm ${
                        isPopular ? "btn-primary" : "btn-outline-primary"
                      }`}
                      onClick={() => choosePlan(plan)}
                    >
                      <span>Subscribe & Pay Now</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Gateway Modal */}
      <PaymentGatewayModal
        show={showCheckoutModal}
        plan={selectedPlanForCheckout}
        onClose={() => {
          setShowCheckoutModal(false);
          setSelectedPlanForCheckout(null);
        }}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

export default CustomerPlans;
