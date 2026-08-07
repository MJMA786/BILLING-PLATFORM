import { Crown, CalendarDays, CheckCircle2, Zap } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";

export default function PlanCard({ subscription }) {
  if (!subscription) return null;

  const plan = subscription.plan || subscription.subscription_plan || {};
  const price = plan.price ?? 0;
  const interval = plan.billing_interval || plan.interval || "month";
  const startDate = subscription.start_date || subscription.current_period_start || subscription.created_at;
  const renewalDate = subscription.renewal_date || subscription.current_period_end;
  const isAutoRenew = subscription.auto_renew ?? (!subscription.cancel_at_period_end);

  return (
    <div className="card border shadow-sm rounded-4 mb-4 bg-white">
      <div className="card-body p-4">
        <div className="row align-items-center g-3">
          <div className="col-lg-7">
            <div className="d-flex align-items-center gap-3">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
                style={{ width: "64px", height: "64px" }}
              >
                <Crown size={32} />
              </div>

              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h3 className="fw-bold text-dark font-display mb-0">{plan.name || "Standard Plan"}</h3>
                  <span
                    className={`badge px-3 py-1 rounded-pill micro-text fw-bold text-uppercase ${
                      subscription.status === "active" ? "bg-success text-white" : "bg-warning text-dark"
                    }`}
                  >
                    <CheckCircle2 size={13} className="me-1" />
                    {subscription.status}
                  </span>
                </div>

                <p className="text-secondary small mb-0 fw-medium">
                  {plan.description || "Active subscription plan with automated recurring billing."}
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="row g-2 text-center">
              <div className="col-6">
                <div className="border border-slate-200 rounded-3 p-3 bg-light">
                  <small className="text-muted micro-text fw-bold text-uppercase d-block mb-1">Plan Price</small>
                  <h4 className="fw-bold text-primary font-display mb-0">{formatCurrency(price)}</h4>
                  <small className="text-secondary micro-text fw-semibold">/ {interval}</small>
                </div>
              </div>

              <div className="col-6">
                <div className="border border-slate-200 rounded-3 p-3 bg-light">
                  <small className="text-muted micro-text fw-bold text-uppercase d-block mb-1">Next Renewal</small>
                  <h6 className="fw-bold text-dark font-display mb-1">{formatDate(renewalDate)}</h6>
                  <small className="text-success micro-text fw-semibold">
                    <CalendarDays size={12} className="me-1" />
                    Auto Renew
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-3 opacity-25" />

        <div className="row text-center g-2">
          <div className="col-6 col-md-3">
            <small className="text-muted micro-text fw-bold text-uppercase d-block">Subscription Ref</small>
            <span className="fw-bold text-dark small font-monospace">SUB-{String(subscription.id).padStart(4, "0")}</span>
          </div>

          <div className="col-6 col-md-3">
            <small className="text-muted micro-text fw-bold text-uppercase d-block">Billing Interval</small>
            <span className="fw-bold text-dark small text-capitalize">{interval}ly</span>
          </div>

          <div className="col-6 col-md-3">
            <small className="text-muted micro-text fw-bold text-uppercase d-block">Start Date</small>
            <span className="fw-bold text-dark small">{formatDate(startDate)}</span>
          </div>

          <div className="col-6 col-md-3">
            <small className="text-muted micro-text fw-bold text-uppercase d-block">Renewal Status</small>
            <span className={`fw-bold small ${isAutoRenew ? "text-success" : "text-danger"}`}>
              {isAutoRenew ? "Auto Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}