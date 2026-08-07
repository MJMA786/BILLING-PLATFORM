import { ArrowUpCircle, Download, CreditCard, Ban, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SubscriptionActions({
  subscription,
  onUpgrade,
  onCancel,
  onResume,
}) {
  const navigate = useNavigate();
  if (!subscription) return null;

  const isCancelled = subscription.status === "cancelled" || subscription.cancel_at_period_end;

  return (
    <div className="card border shadow-sm rounded-4 mt-4 bg-white">
      <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
        <h5 className="fw-bold text-dark font-display mb-1">Subscription Actions</h5>
        <small className="text-secondary fw-medium">Manage your active subscription, upgrade tiers, or download statements.</small>
      </div>

      <div className="card-body p-4">
        <div className="row g-3">
          {/* Upgrade Plan */}
          <div className="col-sm-6 col-md-3">
            <button
              className="btn btn-primary w-100 py-3 rounded-3 shadow-sm d-flex flex-column align-items-center justify-content-center gap-1"
              onClick={onUpgrade}
            >
              <ArrowUpCircle size={22} />
              <span className="fw-bold small">Upgrade Plan</span>
            </button>
          </div>

          {/* View Invoices */}
          <div className="col-sm-6 col-md-3">
            <button
              className="btn btn-outline-primary w-100 py-3 rounded-3 d-flex flex-column align-items-center justify-content-center gap-1"
              onClick={() => navigate("/customer/invoices")}
            >
              <Download size={22} />
              <span className="fw-bold small">My Invoices</span>
            </button>
          </div>

          {/* View Payments */}
          <div className="col-sm-6 col-md-3">
            <button
              className="btn btn-outline-secondary w-100 py-3 rounded-3 d-flex flex-column align-items-center justify-content-center gap-1 text-dark"
              onClick={() => navigate("/customer/payments")}
            >
              <CreditCard size={22} />
              <span className="fw-bold small">My Payments</span>
            </button>
          </div>

          {/* Cancel / Resume */}
          <div className="col-sm-6 col-md-3">
            {isCancelled ? (
              <button
                className="btn btn-success w-100 py-3 rounded-3 d-flex flex-column align-items-center justify-content-center gap-1 shadow-sm"
                onClick={onResume}
              >
                <RotateCcw size={22} />
                <span className="fw-bold small">Resume Plan</span>
              </button>
            ) : (
              <button
                className="btn btn-outline-danger w-100 py-3 rounded-3 d-flex flex-column align-items-center justify-content-center gap-1"
                onClick={onCancel}
              >
                <Ban size={22} />
                <span className="fw-bold small">Cancel Plan</span>
              </button>
            )}
          </div>
        </div>

        <div className={`alert ${isCancelled ? "alert-warning" : "alert-info"} border-0 small mb-0 mt-4 d-flex align-items-center rounded-3`}>
          <span>
            <strong>Note:</strong> {isCancelled ? "Your subscription is set to end at the conclusion of the current billing cycle." : "Your subscription will automatically renew each billing period."}
          </span>
        </div>
      </div>
    </div>
  );
}