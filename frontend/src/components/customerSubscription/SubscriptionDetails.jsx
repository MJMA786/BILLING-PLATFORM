import { Hash, Calendar, CreditCard, Repeat, User, CheckCircle2 } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";

export default function SubscriptionDetails({ subscription }) {
  if (!subscription) return null;

  const plan = subscription.plan || subscription.subscription_plan || {};
  const custName = subscription.customer?.company_name || subscription.customer?.contact_person || "Valued Customer";
  const startDate = subscription.start_date || subscription.current_period_start || subscription.created_at;
  const renewalDate = subscription.renewal_date || subscription.current_period_end;
  const isAutoRenew = subscription.auto_renew ?? (!subscription.cancel_at_period_end);

  const details = [
    {
      icon: Hash,
      title: "Subscription Reference",
      value: `SUB-${String(subscription.id).padStart(4, "0")}`,
      color: "primary",
    },
    {
      icon: User,
      title: "Account Holder",
      value: custName,
      color: "info",
    },
    {
      icon: Calendar,
      title: "Start Date",
      value: formatDate(startDate),
      color: "success",
    },
    {
      icon: Repeat,
      title: "Billing Frequency",
      value: `${plan.billing_interval || plan.interval || "Monthly"}ly`,
      color: "warning",
    },
    {
      icon: CreditCard,
      title: "Price Per Cycle",
      value: formatCurrency(plan.price ?? 0),
      color: "primary",
    },
    {
      icon: CheckCircle2,
      title: "Auto Renewal",
      value: isAutoRenew ? "Enabled" : "Disabled",
      color: isAutoRenew ? "success" : "danger",
    },
  ];

  return (
    <div className="card border shadow-sm rounded-4 h-100 bg-white">
      <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
        <h5 className="fw-bold text-dark font-display mb-1">Subscription Summary</h5>
        <small className="text-secondary fw-medium">Essential billing details and account parameters.</small>
      </div>

      <div className="card-body p-4">
        <div className="row g-3">
          {details.map((item, index) => {
            const Icon = item.icon;
            return (
              <div className="col-md-6" key={index}>
                <div className="border border-slate-200 rounded-3 p-3 h-100 bg-light">
                  <div className="d-flex align-items-center gap-3">
                    <div className={`p-2.5 rounded-circle bg-${item.color}-subtle text-${item.color} d-flex align-items-center justify-content-center flex-shrink-0`}>
                      <Icon size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <small className="text-muted micro-text fw-bold text-uppercase d-block mb-0.5">{item.title}</small>
                      <div className="fw-bold text-dark small text-truncate">{item.value}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="alert alert-success border-0 bg-success-subtle text-success small mb-0 mt-4 d-flex align-items-center rounded-3">
          <CheckCircle2 size={18} className="me-2 flex-shrink-0" />
          <span>
            Subscription is active and scheduled to renew on <strong className="ms-1">{formatDate(renewalDate)}</strong>.
          </span>
        </div>
      </div>
    </div>
  );
}