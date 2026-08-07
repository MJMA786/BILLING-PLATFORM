import { formatCurrency } from "../../utils/formatters";

export default function AddSubscriptionModal({
  show,
  customers = [],
  plans = [],
  creating,
  selectedCustomerId,
  setSelectedCustomerId,
  selectedPlanId,
  setSelectedPlanId,
  onClose,
  onSave,
}) {
  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(15,23,42,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow">

          <form onSubmit={onSave}>

            {/* Header */}
            <div className="modal-header border-0">
              <div>
                <h5 className="fw-bold mb-1">
                  Assign Plan Subscription
                </h5>
                <small className="text-muted">
                  Assign a subscription plan to a customer.
                </small>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body p-4">

              {/* Select Customer */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Select Customer
                </label>

                <select
                  className="form-select"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  required
                >
                  <option value="">
                    -- Choose Customer --
                  </option>
                  {customers.map((cust) => (
                    <option key={cust.id} value={cust.id}>
                      {cust.company_name || cust.contact_person} ({cust.billing_email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Plan */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Select Subscription Plan
                </label>

                <select
                  className="form-select"
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  required
                >
                  <option value="">
                    -- Choose Plan --
                  </option>

                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} • {formatCurrency(plan.price)} / {plan.billing_interval}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPlanId && (
                <div className="alert alert-light border rounded-3">
                  {plans
                    .filter((plan) => String(plan.id) === String(selectedPlanId))
                    .map((plan) => (
                      <div key={plan.id}>
                        <h6 className="fw-bold mb-1">{plan.name}</h6>
                        <div className="small text-muted">
                          {formatCurrency(plan.price)} / {plan.billing_interval}
                        </div>
                        <div className="small text-muted">
                          Trial: {plan.trial_days} days
                        </div>
                      </div>
                    ))}
                </div>
              )}

              <div className="alert alert-info small mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Creating a subscription will automatically generate the initial billing cycle, invoice, payment record, and send email notifications.
              </div>

            </div>

            {/* Footer */}
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-light rounded-3"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary rounded-3 fw-semibold"
                disabled={creating}
              >
                {creating
                  ? "Creating Subscription..."
                  : "Confirm Subscription"}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}