import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import customerService from "../../services/customerService";
import {
  Zap,
  User,
  Building,
  Mail,
  Phone,
  Globe,
  ShieldCheck,
  Save,
  MapPin,
  CheckCircle2,
  Lock,
} from "lucide-react";

function CustomerProfile() {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();

  const customer = user?.customer || {};

  const [companyName, setCompanyName] = useState(customer.company_name || user?.name || "");
  const [contactPerson, setContactPerson] = useState(customer.contact_person || user?.name || "");
  const [billingEmail, setBillingEmail] = useState(customer.billing_email || user?.email || "");
  const [phone, setPhone] = useState(customer.phone || "");
  const [country, setCountry] = useState(customer.country || "India");
  const [taxId, setTaxId] = useState(customer.tax_id || "");
  const [addressLine1, setAddressLine1] = useState(customer.address_line1 || "");
  const [city, setCity] = useState(customer.city || "");
  const [state, setState] = useState(customer.state || "");
  const [postalCode, setPostalCode] = useState(customer.postal_code || "");
  const [saving, setSaving] = useState(false);

  const isGoogleUser = user?.auth_provider === "google" || user?.auth_provider === "GOOGLE" || !!user?.google_id;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!customer?.id) {
      showToast("Customer profile reference not found.", "danger");
      return;
    }

    try {
      setSaving(true);

      const updated = await customerService.updateCustomer(customer.id, {
        company_name: companyName,
        contact_person: contactPerson,
        billing_email: billingEmail,
        phone,
        country,
        tax_id: taxId,
        address_line1: addressLine1,
        city,
        state,
        postal_code: postalCode,
        currency: customer.currency || "USD",
        timezone: customer.timezone || "UTC",
      });

      setUser({
        ...user,
        customer: updated,
      });

      showToast("Company & Billing profile updated successfully! 🎉", "success");
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to update profile.", "danger");
    } finally {
      setSaving(false);
    }
  };

  const initialLetter = (companyName || user?.name || "C").charAt(0).toUpperCase();

  return (
    <div className="customer-profile py-2">
      {/* Clean Header */}
      <div className="card border shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1.5 fw-bold micro-text mb-2">
              <Zap size={14} className="me-1" /> Customer Profile & Authentication Identity
            </span>
            <h2 className="fw-bold text-dark mb-1 font-display fs-3">
              My Profile & Billing Details
            </h2>
            <p className="text-secondary mb-0 small fw-medium">
              View your authentication method, company profile, tax identifiers, and official billing address.
            </p>
          </div>

          <div className="text-end">
            <span className={`badge ${isGoogleUser ? "bg-danger-subtle text-danger border-danger" : "bg-primary-subtle text-primary border-primary"} border rounded-pill px-3 py-2 fw-bold micro-text d-inline-flex align-items-center gap-1.5`}>
              {isGoogleUser ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  Google OAuth Single Sign-On
                </>
              ) : (
                <>
                  <Lock size={14} /> Email & Password Account
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Form */}
        <div className="col-lg-8">
          <div className="card border border-slate-200 shadow-sm rounded-4 bg-white">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
              <h5 className="fw-bold text-dark font-display mb-1">Company & Billing Profile</h5>
              <small className="text-secondary fw-medium">Official billing address and account parameters.</small>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleUpdateProfile}>
                <div className="row g-3">
                  {/* Company Name */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-dark mb-1">
                      <Building size={14} className="me-1 text-primary" /> Company / Organization Name
                    </label>
                    <input
                      className="form-control shadow-none small font-display"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Billing Solutions"
                      required
                    />
                  </div>

                  {/* Contact Person */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-dark mb-1">
                      <User size={14} className="me-1 text-primary" /> Contact Person
                    </label>
                    <input
                      className="form-control shadow-none small font-display"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  {/* Billing Email */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-dark mb-1">
                      <Mail size={14} className="me-1 text-primary" /> Official Billing Email
                    </label>
                    <input
                      type="email"
                      className="form-control shadow-none small font-display"
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      placeholder="billing@company.com"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-dark mb-1">
                      <Phone size={14} className="me-1 text-primary" /> Phone Number
                    </label>
                    <input
                      className="form-control shadow-none small font-display"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>

                  {/* Tax ID / GSTIN */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-dark mb-1">
                      <ShieldCheck size={14} className="me-1 text-primary" /> Tax ID / GSTIN
                    </label>
                    <input
                      className="form-control shadow-none small font-display"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>

                  {/* Country */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-dark mb-1">
                      <Globe size={14} className="me-1 text-primary" /> Country
                    </label>
                    <input
                      className="form-control shadow-none small font-display"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="India"
                      required
                    />
                  </div>

                  {/* Address Line 1 */}
                  <div className="col-12">
                    <label className="form-label small fw-bold text-dark mb-1">
                      <MapPin size={14} className="me-1 text-primary" /> Street Address
                    </label>
                    <input
                      className="form-control shadow-none small font-display"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="123 Tech Park, Suite 400"
                    />
                  </div>

                  {/* City, State, Postal Code */}
                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-dark mb-1">City</label>
                    <input
                      className="form-control shadow-none small font-display"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bangalore"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-dark mb-1">State</label>
                    <input
                      className="form-control shadow-none small font-display"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Karnataka"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-dark mb-1">Postal Code</label>
                    <input
                      className="form-control shadow-none small font-display"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="560001"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-2 border-top">
                  <button
                    className="btn btn-primary px-4 py-2.5 rounded-3 fw-bold small shadow-sm d-inline-flex align-items-center gap-2"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1"></span>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save size={16} /> Save Profile Details
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Preview Card */}
        <div className="col-lg-4">
          <div className="card border border-slate-200 shadow-sm rounded-4 text-center p-4 bg-white">
            {/* Avatar Section: Image for Google User, Initials for Standard User */}
            <div className="position-relative d-inline-block mx-auto mb-3">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user?.name || "Profile"}
                  className="rounded-circle border border-2 border-primary shadow-sm"
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div
                  className="rounded-circle bg-primary text-white font-display fw-bold d-flex align-items-center justify-content-center mx-auto shadow-sm"
                  style={{
                    width: 80,
                    height: 80,
                    fontSize: "1.85rem",
                  }}
                >
                  {initialLetter}
                </div>
              )}
            </div>

            <h5 className="fw-bold text-dark font-display mb-1">
              {user?.name || companyName || "Valued Customer"}
            </h5>

            <p className="text-secondary small mb-2 fw-medium">
              {user?.email || billingEmail}
            </p>

            <div className="d-flex justify-content-center gap-1.5 flex-wrap mb-3">
              <span className="badge bg-success-subtle text-success border border-success border-opacity-25 rounded-pill px-3 py-1 fw-bold micro-text">
                <CheckCircle2 size={13} className="me-1" /> Verified Account
              </span>

              {isGoogleUser ? (
                <span className="badge bg-danger-subtle text-danger border border-danger border-opacity-25 rounded-pill px-3 py-1 fw-bold micro-text">
                  Google SSO
                </span>
              ) : (
                <span className="badge bg-primary-subtle text-primary border border-primary border-opacity-25 rounded-pill px-3 py-1 fw-bold micro-text">
                  Password Auth
                </span>
              )}
            </div>

            <hr className="my-3 opacity-25" />

            {/* Authentication Metadata */}
            <div className="text-start small">
              <div className="d-flex justify-content-between align-items-center mb-2.5">
                <span className="text-muted micro-text fw-bold text-uppercase">Sign-in Method</span>
                <span className="fw-bold text-dark small">
                  {isGoogleUser ? "Google OAuth 2.0" : "Standard Email / Password"}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2.5">
                <span className="text-muted micro-text fw-bold text-uppercase">Contact Person</span>
                <span className="fw-bold text-dark small">{contactPerson || user?.name || "-"}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2.5">
                <span className="text-muted micro-text fw-bold text-uppercase">Country</span>
                <span className="fw-bold text-dark small">{country || "India"}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted micro-text fw-bold text-uppercase">Account Tier</span>
                <span className="badge bg-light text-dark border fw-bold text-capitalize micro-text">
                  {user?.role || "Customer"}
                </span>
              </div>
            </div>

            {isGoogleUser && (
              <div className="alert alert-info border-0 bg-info-subtle text-info small mb-0 mt-4 text-start rounded-3">
                <small className="d-block micro-text fw-semibold">
                  <strong>Google Account Synced:</strong> Profile picture and name are automatically synchronized from your Google account.
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;