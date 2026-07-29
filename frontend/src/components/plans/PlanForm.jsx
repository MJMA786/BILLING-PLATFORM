import { useEffect, useState } from "react";

function PlanForm({
  show,
  onClose,
  onSave,
  plan = null,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "INR",
    interval: "monthly",
    active: true,
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        interval: plan.interval,
        active: plan.active,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        currency: "INR",
        interval: "monthly",
        active: true,
      });
    }
  }, [plan]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
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
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">

            <div className="modal-header">

              <h5 className="modal-title">
                {plan ? "Edit Plan" : "Add Plan"}
              </h5>

              <button
                className="btn-close"
                onClick={onClose}
              ></button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="modal-body">

                <div className="mb-3">

                  <label className="form-label">
                    Plan Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    minLength={3}
                    maxLength={100}
                    required
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Description
                  </label>

                  <textarea
                    className="form-control"
                    rows="3"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>

                </div>

                <div className="row">

                  <div className="col-md-4">

                    <label className="form-label">
                      Price
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="1"
                      step="0.01"
                      required
                    />

                  </div>

                  <div className="col-md-4">

                    <label className="form-label">
                      Currency
                    </label>

                    <select
                      className="form-select"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>

                  </div>

                  <div className="col-md-4">

                    <label className="form-label">
                      Billing Interval
                    </label>

                    <select
                      className="form-select"
                      name="interval"
                      value={formData.interval}
                      onChange={handleChange}
                    >
                      <option value="monthly">
                        Monthly
                      </option>

                      <option value="annual">
                        Annual
                      </option>
                    </select>

                  </div>

                </div>

                <div className="form-check mt-4">

                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    id="activeCheck"
                  />

                  <label
                    className="form-check-label"
                    htmlFor="activeCheck"
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
                  Save
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