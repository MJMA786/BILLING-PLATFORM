import { useEffect, useState } from "react";

const initialState = {
  name: "",
  description: "",
  price: "",
  currency: "INR",
  billing_interval: "monthly",
  trial_days: 14,
  features: {},
  is_active: true,
};

function PlanForm({
  show,
  onClose,
  onSave,
  plan = null,
}) {
  const [formData, setFormData] =
    useState(initialState);

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || "",
        description:
          plan.description || "",
        price: plan.price || "",
        currency:
          plan.currency || "INR",
        billing_interval:
          plan.billing_interval ||
          "monthly",
        trial_days:
          plan.trial_days ?? 14,
        features:
          plan.features || {},
        is_active:
          plan.is_active ?? true,
      });
    } else {
      setFormData(initialState);
    }
  }, [plan]);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "trial_days"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">
                {plan
                  ? "Edit Plan"
                  : "Add Plan"}
              </h5>

              <button
                className="btn-close"
                onClick={onClose}
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                <div className="mb-3">
                  <label className="form-label">
                    Plan Name
                  </label>

                  <input
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Description
                  </label>

                  <textarea
                    className="form-control"
                    rows={3}
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">

                  <div className="col-md-3">
                    <label className="form-label">
                      Price
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={
                        formData.price
                      }
                      onChange={
                        handleChange
                      }
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">
                      Currency
                    </label>

                    <select
                      className="form-select"
                      name="currency"
                      value={
                        formData.currency
                      }
                      onChange={
                        handleChange
                      }
                    >
                      <option value="INR">
                        INR
                      </option>

                      <option value="USD">
                        USD
                      </option>

                      <option value="EUR">
                        EUR
                      </option>

                      <option value="GBP">
                        GBP
                      </option>

                      <option value="AED">
                        AED
                      </option>

                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">
                      Billing
                    </label>

                    <select
                      className="form-select"
                      name="billing_interval"
                      value={
                        formData.billing_interval
                      }
                      onChange={
                        handleChange
                      }
                    >
                      <option value="monthly">
                        Monthly
                      </option>

                      <option value="annual">
                        Annual
                      </option>

                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">
                      Trial Days
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      name="trial_days"
                      value={
                        formData.trial_days
                      }
                      onChange={
                        handleChange
                      }
                      min="0"
                    />
                  </div>

                </div>

                <div className="form-check mt-4">

                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="is_active"
                    checked={
                      formData.is_active
                    }
                    onChange={
                      handleChange
                    }
                    id="activeCheck"
                  />

                  <label
                    htmlFor="activeCheck"
                    className="form-check-label"
                  >
                    Active Plan
                  </label>

                </div>

              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save Plan
                </button>

              </div>

            </form>

          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default PlanForm;