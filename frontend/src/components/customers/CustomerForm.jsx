import { useEffect, useState } from "react";

const initialState = {
  company_name: "",
  contact_person: "",
  billing_email: "",
  phone: "",
  country: "",
  currency: "USD",
  timezone: "UTC",
};

function CustomerForm({
  show,
  onClose,
  onSave,
  customer = null,
}) {
  const [formData, setFormData] =
    useState(initialState);

  useEffect(() => {
    if (customer) {
      setFormData({
        company_name:
          customer.company_name || "",
        contact_person:
          customer.contact_person || "",
        billing_email:
          customer.billing_email || "",
        phone: customer.phone || "",
        country: customer.country || "",
        currency:
          customer.currency || "USD",
        timezone:
          customer.timezone || "UTC",
      });
    } else {
      setFormData(initialState);
    }
  }, [customer]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
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
                {customer
                  ? "Edit Customer"
                  : "Add Customer"}
              </h5>

              <button
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                <div className="row">

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Company Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="company_name"
                      value={
                        formData.company_name
                      }
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Contact Person
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="contact_person"
                      value={
                        formData.contact_person
                      }
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Billing Email
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      name="billing_email"
                      value={
                        formData.billing_email
                      }
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Phone
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Country
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="country"
                      value={
                        formData.country
                      }
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Currency
                    </label>

                    <select
                      className="form-select"
                      name="currency"
                      value={
                        formData.currency
                      }
                      onChange={handleChange}
                    >
                      <option value="USD">
                        USD
                      </option>
                      <option value="INR">
                        INR
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

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Timezone
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="timezone"
                      value={
                        formData.timezone
                      }
                      onChange={handleChange}
                    />
                  </div>

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
                  Save Customer
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

export default CustomerForm;