import {
  X,
  Mail,
  MapPin,
  Calendar,
  BadgeCheck,
  Phone,
  Building2,
  Globe,
} from "lucide-react";

import { formatDate } from "../../utils/formatters";

export default function CustomerProfileDrawer({
  show,
  customer,
  onClose,
}) {
  if (!show || !customer) return null;

  const company =
    customer.company_name || "Company";

  const contact =
    customer.contact_person || "-";

  const email =
    customer.billing_email ||
    "customer@example.com";

  const phone =
    customer.phone || "-";

  const country =
    customer.country || "-";

  const currency =
    customer.currency || "USD";

  const timezone =
    customer.timezone || "UTC";

  const joinDate = formatDate(
    customer.created_at
  );

  return (
    <>
      {/* Overlay */}

      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          background:
            "rgba(15,23,42,.45)",
          zIndex: 1040,
        }}
        onClick={onClose}
      />

      {/* Drawer */}

      <div
        className="position-fixed top-0 end-0 bg-white shadow-lg h-100 d-flex flex-column"
        style={{
          width: 450,
          maxWidth: "100%",
          zIndex: 1050,
          overflowY: "auto",
        }}
      >
        {/* Header */}

        <div className="p-4 border-bottom bg-light d-flex justify-content-between align-items-center">

          <div>

            <span className="badge bg-primary-subtle text-primary rounded-pill mb-2">
              Customer Profile
            </span>

            <h4 className="fw-bold mb-0">
              {company}
            </h4>

          </div>

          <button
            className="btn btn-light rounded-circle"
            onClick={onClose}
          >
            <X size={18} />
          </button>

        </div>

        {/* Avatar */}

        <div className="text-center py-4">

          <div
            className="mx-auto rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow"
            style={{
              width: 90,
              height: 90,
              fontSize: 36,
            }}
          >
            {company
              .charAt(0)
              .toUpperCase()}
          </div>

          <h4 className="fw-bold mt-3">
            {company}
          </h4>

          <p className="text-muted mb-0">
            {contact}
          </p>

          <span className="badge bg-success-subtle text-success mt-2">
            {customer.is_active
              ? "Active Customer"
              : "Inactive Customer"}
          </span>

        </div>

        {/* Company */}

        <div className="px-4 pb-3">

          <div className="card border-0 bg-light rounded-4 p-3 mb-3">

            <h6 className="fw-bold mb-3">
              Company Information
            </h6>

            <div className="d-flex mb-3">

              <Building2
                size={18}
                className="text-primary me-3 mt-1"
              />

              <div>

                <small className="text-muted">
                  Company
                </small>

                <div className="fw-semibold">
                  {company}
                </div>

              </div>

            </div>

            <div className="d-flex">

              <Phone
                size={18}
                className="text-primary me-3 mt-1"
              />

              <div>

                <small className="text-muted">
                  Contact Person
                </small>

                <div className="fw-semibold">
                  {contact}
                </div>

              </div>

            </div>

          </div>

          {/* Contact */}

          <div className="card border-0 bg-light rounded-4 p-3 mb-3">

            <h6 className="fw-bold mb-3">
              Contact
            </h6>

            <div className="d-flex mb-3">

              <Mail
                size={18}
                className="text-primary me-3 mt-1"
              />

              <div>

                <small className="text-muted">
                  Billing Email
                </small>

                <div className="fw-semibold">
                  {email}
                </div>

              </div>

            </div>

            <div className="d-flex">

              <Phone
                size={18}
                className="text-primary me-3 mt-1"
              />

              <div>

                <small className="text-muted">
                  Phone
                </small>

                <div className="fw-semibold">
                  {phone}
                </div>

              </div>

            </div>

          </div>

          {/* Location */}

          <div className="card border-0 bg-light rounded-4 p-3 mb-3">

            <h6 className="fw-bold mb-3">
              Location
            </h6>

            <div className="d-flex mb-3">

              <MapPin
                size={18}
                className="text-primary me-3 mt-1"
              />

              <div>

                <small className="text-muted">
                  Country
                </small>

                <div className="fw-semibold">
                  {country}
                </div>

              </div>

            </div>

            <div className="d-flex">

              <Globe
                size={18}
                className="text-primary me-3 mt-1"
              />

              <div>

                <small className="text-muted">
                  Currency / Timezone
                </small>

                <div className="fw-semibold">
                  {currency} • {timezone}
                </div>

              </div>

            </div>

          </div>

          {/* Account */}

          <div className="card border-0 bg-light rounded-4 p-3">

            <h6 className="fw-bold mb-3">
              Account
            </h6>

            <div className="d-flex mb-3">

              <Calendar
                size={18}
                className="text-primary me-3 mt-1"
              />

              <div>

                <small className="text-muted">
                  Member Since
                </small>

                <div className="fw-semibold">
                  {joinDate}
                </div>

              </div>

            </div>

            <div className="d-flex">

              <BadgeCheck
                size={18}
                className="text-success me-3 mt-1"
              />

              <div>

                <small className="text-muted">
                  Status
                </small>

                <div className="fw-semibold">
                  {customer.is_active
                    ? "Verified & Active"
                    : "Inactive"}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}