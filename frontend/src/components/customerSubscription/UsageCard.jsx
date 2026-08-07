import { Calendar, Clock, RefreshCw, Activity } from "lucide-react";

export default function UsageCard({ subscription }) {
  if (!subscription) return null;

  const startDateStr = subscription.start_date || subscription.current_period_start || subscription.created_at;
  const renewalDateStr = subscription.renewal_date || subscription.current_period_end;

  const start = startDateStr ? new Date(startDateStr) : new Date();
  const end = renewalDateStr ? new Date(renewalDateStr) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const now = new Date();

  const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  const usedDays = Math.max(0, Math.ceil((now - start) / (1000 * 60 * 60 * 24)));
  const remainingDays = Math.max(0, totalDays - usedDays);
  const percentage = Math.min(100, Math.max(0, Math.round((usedDays / totalDays) * 100)));

  const isAutoRenew = subscription.auto_renew ?? (!subscription.cancel_at_period_end);

  return (
    <div className="card border shadow-sm rounded-4 h-100 bg-white">
      <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
        <h5 className="fw-bold text-dark font-display mb-1">Billing Cycle Progress</h5>
        <small className="text-secondary fw-medium">Active subscription cycle health & elapsed timeline.</small>
      </div>

      <div className="card-body p-4 d-flex flex-column justify-content-between">
        <div>
          {/* Days Used */}
          <div className="mb-3.5">
            <div className="d-flex justify-content-between align-items-center mb-1.5">
              <div className="d-flex align-items-center gap-2">
                <Calendar size={16} className="text-primary" />
                <span className="fw-bold text-dark small">Days Elapsed</span>
              </div>
              <span className="fw-bold text-dark small">{usedDays} / {totalDays} Days</span>
            </div>
            <div className="progress rounded-pill bg-light border border-slate-200" style={{ height: "10px" }}>
              <div className="progress-bar bg-primary rounded-pill" style={{ width: `${percentage}%` }}></div>
            </div>
          </div>

          {/* Days Remaining */}
          <div className="mb-3.5">
            <div className="d-flex justify-content-between align-items-center mb-1.5">
              <div className="d-flex align-items-center gap-2">
                <Clock size={16} className="text-success" />
                <span className="fw-bold text-dark small">Days Remaining</span>
              </div>
              <span className="fw-bold text-success small">{remainingDays} Days</span>
            </div>
            <div className="progress rounded-pill bg-light border border-slate-200" style={{ height: "10px" }}>
              <div className="progress-bar bg-success rounded-pill" style={{ width: `${100 - percentage}%` }}></div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="row g-2 pt-2 text-center">
            <div className="col-6">
              <div className="border border-slate-200 rounded-3 p-2.5 bg-light">
                <div className="d-flex align-items-center justify-content-center gap-1.5 mb-1">
                  <RefreshCw size={14} className={isAutoRenew ? "text-success" : "text-danger"} />
                  <small className="text-muted micro-text fw-bold text-uppercase">Auto Renewal</small>
                </div>
                <span className={`fw-bold small ${isAutoRenew ? "text-success" : "text-danger"}`}>
                  {isAutoRenew ? "ENABLED" : "DISABLED"}
                </span>
              </div>
            </div>

            <div className="col-6">
              <div className="border border-slate-200 rounded-3 p-2.5 bg-light">
                <div className="d-flex align-items-center justify-content-center gap-1.5 mb-1">
                  <Activity size={14} className="text-info" />
                  <small className="text-muted micro-text fw-bold text-uppercase">Status</small>
                </div>
                <span className="fw-bold text-dark small text-uppercase">{subscription.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-3 border-top mt-3">
          <h2 className="fw-bold text-primary mb-0 font-display fs-2">{percentage}%</h2>
          <small className="text-secondary fw-semibold micro-text">Current Billing Cycle Progress</small>
        </div>
      </div>
    </div>
  );
}