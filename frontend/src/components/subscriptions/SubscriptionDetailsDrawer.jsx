import {
  X,
  Mail,
  Calendar,
  CreditCard,
  BadgeCheck,
  Clock,
  RefreshCw,
} from "lucide-react";

import { formatCurrency, formatDate } from "../../utils/formatters";

export default function SubscriptionDetailsDrawer({
  show,
  subscription,
  onClose,
  onCancel,
  onResume,
  onDelete,
}) {
  if (!show || !subscription) return null;

  const isCancelled = subscription.status === "cancelled" || subscription.cancel_at_period_end;

  return (
    <>
      {/* Overlay */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          background: "rgba(15,23,42,.55)",
          zIndex: 1040,
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="position-fixed top-0 end-0 bg-white shadow-lg h-100 d-flex flex-column"
        style={{
          width: "460px",
          maxWidth: "100%",
          zIndex: 1050,
        }}
      >
        {/* Header */}
        <div className="border-bottom p-4 d-flex justify-content-between align-items-center flex-shrink-0">
          <div>
            <span className="badge bg-primary-subtle text-primary rounded-pill mb-2">
              Subscription Details
            </span>
            <h5 className="fw-bold mb-0">
              Customer Subscription
            </h5>
          </div>

          <button
            className="btn btn-light rounded-circle"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-grow-1 overflow-y-auto p-4">
          {/* Customer */}
          <div className="text-center mb-4">
            <div
              className="mx-auto rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center shadow-sm"
              style={{
                width: 84,
                height: 84,
                fontSize: 34,
              }}
            >
              {subscription.customer?.company_name?.charAt(0)?.toUpperCase() || subscription.customer?.contact_person?.charAt(0)?.toUpperCase() || "C"}
            </div>

            <h4 className="fw-bold mt-3 mb-1">
              {subscription.customer?.company_name || subscription.customer?.contact_person}
            </h4>

            <p className="text-muted mb-3">
              {subscription.customer?.billing_email}
            </p>
            
            <span className={`badge px-3 py-2 rounded-pill ${isCancelled ? "bg-warning-subtle text-warning" : "bg-success-subtle text-success"}`}>
              {isCancelled ? "Cancelled Subscription" : "Active Subscription"}
            </span>
          </div>

          {/* Subscription Information */}
          <div className="card border-0 bg-light rounded-4 p-3 mb-3">
            <h6 className="fw-bold mb-3">Subscription</h6>

            <div className="d-flex align-items-center gap-3 mb-3">
              <CreditCard size={18} className="text-primary" />
              <div>
                <small className="text-muted d-block">Current Plan</small>
                <strong>{subscription.plan?.name}</strong>
                <div className="small text-muted">
                  {formatCurrency(subscription.plan?.price)} / {subscription.plan?.billing_interval}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <BadgeCheck size={18} className="text-success" />
              <div>
                <small className="text-muted d-block">Status</small>
                <strong className="text-capitalize">{subscription.status}</strong>
              </div>
            </div>
          </div>

          {/* Billing */}
          <div className="card border-0 bg-light rounded-4 p-3 mb-3">
            <h6 className="fw-bold mb-3">Billing Information</h6>

            <div className="d-flex align-items-center gap-3 mb-3">
              <Calendar size={18} className="text-primary" />
              <div>
                <small className="text-muted d-block">Current Period</small>
                <strong>
                  {formatDate(subscription.current_period_start)} {" → "} {formatDate(subscription.current_period_end)}
                </strong>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <RefreshCw size={18} className="text-primary" />
              <div>
                <small className="text-muted d-block">Auto Renew</small>
                <strong>{subscription.cancel_at_period_end ? "Disabled" : "Enabled"}</strong>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card border-0 bg-light rounded-4 p-3">
            <h6 className="fw-bold mb-3">Timeline</h6>
            <div className="position-relative ps-3 border-start border-2 border-primary ms-2">
              <div className="mb-3">
                <small className="text-muted d-block">{formatDate(subscription.created_at)}</small>
                <strong className="d-block">Subscription Created</strong>
                <span className="small text-secondary">Customer successfully subscribed.</span>
              </div>

              <div>
                <Clock size={16} className="me-2 text-primary" />
                <strong>Renewal Scheduled</strong>
                <div className="small text-secondary">{formatDate(subscription.current_period_end)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div className="p-4 border-top bg-light flex-shrink-0 d-flex gap-2">
          {isCancelled ? (
            <button
              className="btn btn-success flex-grow-1 rounded-3 fw-semibold"
              onClick={() => onResume && onResume(subscription.id)}
            >
              Resume Subscription
            </button>
          ) : (
            <button
              className="btn btn-warning flex-grow-1 rounded-3 fw-semibold text-dark"
              onClick={() => onCancel && onCancel(subscription.id)}
            >
              Cancel Subscription
            </button>
          )}

          <button
            className="btn btn-outline-danger rounded-3"
            onClick={() => onDelete && onDelete(subscription)}
            title="Delete Subscription"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}