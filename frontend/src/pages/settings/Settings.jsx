import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import PageHeader from "../../components/common/PageHeader";
import settingService from "../../services/settingService";
import AuthService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  User,
  Shield,
  Building,
  CreditCard,
  Mail,
  Sliders,
  Lock,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // System Settings State
  const [settings, setSettings] = useState({
    company_name: "Subly Platform",
    company_email: "support@subly.com",
    company_phone: "+1 (800) 555-0199",
    company_address: "100 Innovation Way, Suite 400, San Francisco, CA 94105",
    company_logo: "",
    invoice_prefix: "INV",
    next_invoice_number: 1001,
    default_currency: "USD",
    default_tax_percentage: 18.0,
    timezone: "UTC",
    date_format: "DD/MM/YYYY",
    support_email: "support@subly.com",
    support_phone: "+1 (800) 555-0199",
    email_notifications_enabled: true,
    maintenance_mode: false,
    allow_new_registrations: true,
    smtp_sender_name: "Subly Platform",
    smtp_sender_email: "noreply@subly.com",
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingService.getSettings();
      if (data) {
        setSettings(data);
      }
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load platform settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const updated = await settingService.updateSettings(settings);
      setSettings(updated);
      showToast("System settings saved successfully!", "success");
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to update settings.", "danger");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      showToast("New passwords do not match.", "danger");
      return;
    }
    try {
      setPasswordLoading(true);
      await AuthService.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      showToast("Admin password updated successfully!", "success");
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to update password.", "danger");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container-fluid py-2">
        <PageHeader
          tag="System Administration"
          title="Platform Settings"
          description="Configure company details, default currency, tax rates, email notifications, and admin account security."
        />

        {error && (
          <div className="alert alert-danger mb-4 d-flex align-items-center" role="alert">
            <AlertCircle size={18} className="me-2" />
            <div>{error}</div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-2">
            <ul className="nav nav-pills nav-fill gap-2">
              <li className="nav-item">
                <button
                  className={`nav-link py-2.5 rounded-3 fw-semibold ${activeTab === "profile" ? "active bg-primary" : "text-dark"}`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User size={16} className="me-2" /> Admin Security
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link py-2.5 rounded-3 fw-semibold ${activeTab === "company" ? "active bg-primary" : "text-dark"}`}
                  onClick={() => setActiveTab("company")}
                >
                  <Building size={16} className="me-2" /> Company & Branding
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link py-2.5 rounded-3 fw-semibold ${activeTab === "billing" ? "active bg-primary" : "text-dark"}`}
                  onClick={() => setActiveTab("billing")}
                >
                  <CreditCard size={16} className="me-2" /> Billing & Tax
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link py-2.5 rounded-3 fw-semibold ${activeTab === "notifications" ? "active bg-primary" : "text-dark"}`}
                  onClick={() => setActiveTab("notifications")}
                >
                  <Mail size={16} className="me-2" /> Email Notifications
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link py-2.5 rounded-3 fw-semibold ${activeTab === "system" ? "active bg-primary" : "text-dark"}`}
                  onClick={() => setActiveTab("system")}
                >
                  <Sliders size={16} className="me-2" /> System Toggles
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Form Container */}
        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading settings...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {/* Left Column: Form Content */}
            <div className="col-lg-8">
              {/* TAB 1: ADMIN PROFILE & SECURITY */}
              {activeTab === "profile" && (
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                  <h5 className="fw-bold text-dark mb-3">Admin Account Security</h5>
                  <p className="text-muted small mb-4">Manage your administrator login credentials and security parameters.</p>

                  <div className="mb-4 p-3 bg-light rounded-3 d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle p-3 me-3 fw-bold fs-5 d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
                      {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">{user?.name || "Administrator"}</h6>
                      <small className="text-muted">{user?.email}</small>
                      <span className="badge bg-danger text-uppercase ms-2 px-2 py-1">ADMINISTRATOR</span>
                    </div>
                  </div>

                  <form onSubmit={handleUpdatePassword}>
                    <h6 className="fw-semibold text-dark mb-3">Change Administrator Password</h6>

                    <div className="mb-3">
                      <label className="form-label text-muted small fw-medium">Current Password</label>
                      <input
                        type="password"
                        name="current_password"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        className="form-control rounded-3"
                        placeholder="Enter current password"
                        required
                      />
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-medium">New Password</label>
                        <input
                          type="password"
                          name="new_password"
                          value={passwordData.new_password}
                          onChange={handlePasswordChange}
                          className="form-control rounded-3"
                          placeholder="Enter new password"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-medium">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirm_password"
                          value={passwordData.confirm_password}
                          onChange={handlePasswordChange}
                          className="form-control rounded-3"
                          placeholder="Confirm new password"
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" disabled={passwordLoading} className="btn btn-primary rounded-3 px-4 fw-semibold">
                      {passwordLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span> Updating...
                        </>
                      ) : (
                        <>
                          <Lock size={16} className="me-2" /> Update Password
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: COMPANY & BRANDING */}
              {activeTab === "company" && (
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                  <h5 className="fw-bold text-dark mb-3">Company Details & Branding</h5>
                  <p className="text-muted small mb-4">Configure public company details used across invoices and billing statements.</p>

                  <form onSubmit={handleSaveSettings}>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-medium">Company Name</label>
                        <input
                          type="text"
                          name="company_name"
                          value={settings.company_name}
                          onChange={handleInputChange}
                          className="form-control rounded-3"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-medium">Company Email</label>
                        <input
                          type="email"
                          name="company_email"
                          value={settings.company_email}
                          onChange={handleInputChange}
                          className="form-control rounded-3"
                          required
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-medium">Company Phone</label>
                        <input
                          type="text"
                          name="company_phone"
                          value={settings.company_phone || ""}
                          onChange={handleInputChange}
                          className="form-control rounded-3"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-medium">Company Address</label>
                        <input
                          type="text"
                          name="company_address"
                          value={settings.company_address || ""}
                          onChange={handleInputChange}
                          className="form-control rounded-3"
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-medium">Support Email</label>
                        <input
                          type="email"
                          name="support_email"
                          value={settings.support_email || ""}
                          onChange={handleInputChange}
                          className="form-control rounded-3"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-medium">Support Phone</label>
                        <input
                          type="text"
                          name="support_phone"
                          value={settings.support_phone || ""}
                          onChange={handleInputChange}
                          className="form-control rounded-3"
                        />
                      </div>
                    </div>

                    <button type="submit" disabled={saving} className="btn btn-primary rounded-3 px-4 fw-semibold">
                      {saving ? "Saving..." : <><Save size={16} className="me-2" /> Save Company Settings</>}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: BILLING & TAX */}
              {activeTab === "billing" && (
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                  <h5 className="fw-bold text-dark mb-3">Billing & Tax Parameters</h5>
                  <p className="text-muted small mb-4">Define default platform currency, tax rates, and invoice numbering schemas.</p>

                  <form onSubmit={handleSaveSettings}>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-medium">Default Currency</label>
                        <select
                          name="default_currency"
                          value={settings.default_currency}
                          onChange={handleInputChange}
                          className="form-select rounded-3"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="INR">INR (₹)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-medium">Default Tax Percentage (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          name="default_tax_percentage"
                          value={settings.default_tax_percentage}
                          onChange={handleInputChange}
                          className="form-control rounded-3"
                          required
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-medium">Invoice Number Prefix</label>
                        <input
                          type="text"
                          name="invoice_prefix"
                          value={settings.invoice_prefix}
                          onChange={handleInputChange}
                          className="form-control rounded-3"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-medium">Next Invoice Sequence Number</label>
                        <input
                          type="number"
                          name="next_invoice_number"
                          value={settings.next_invoice_number}
                          onChange={handleInputChange}
                          className="form-control rounded-3"
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" disabled={saving} className="btn btn-primary rounded-3 px-4 fw-semibold">
                      {saving ? "Saving..." : <><Save size={16} className="me-2" /> Save Billing Parameters</>}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: EMAIL NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                  <h5 className="fw-bold text-dark mb-3">Email & SMTP Settings</h5>
                  <p className="text-muted small mb-4">Manage automated email triggers and SMTP sender configuration.</p>

                  <form onSubmit={handleSaveSettings}>
                    <div className="form-check form-switch mb-4 p-3 bg-light rounded-3 ms-0">
                      <input
                        type="checkbox"
                        name="email_notifications_enabled"
                        checked={settings.email_notifications_enabled}
                        onChange={handleInputChange}
                        className="form-check-input ms-0 me-3 fs-5"
                        id="emailNotifySwitch"
                      />
                      <label className="form-check-label fw-semibold text-dark" htmlFor="emailNotifySwitch">
                        Enable Automated Email Notifications (Password Reset, Receipts, Plan Confirmations)
                      </label>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-medium">SMTP Display Sender Name</label>
                        <input
                          type="text"
                          name="smtp_sender_name"
                          value={settings.smtp_sender_name}
                          onChange={handleInputChange}
                          className="form-control rounded-3"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-medium">SMTP Display Sender Email</label>
                        <input
                          type="email"
                          name="smtp_sender_email"
                          value={settings.smtp_sender_email}
                          onChange={handleInputChange}
                          className="form-control rounded-3"
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" disabled={saving} className="btn btn-primary rounded-3 px-4 fw-semibold">
                      {saving ? "Saving..." : <><Save size={16} className="me-2" /> Save Email Settings</>}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: SYSTEM TOGGLES */}
              {activeTab === "system" && (
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                  <h5 className="fw-bold text-dark mb-3">System Features & Localization</h5>
                  <p className="text-muted small mb-4">Toggle global system modes, user registration rules, and localization presets.</p>

                  <form onSubmit={handleSaveSettings}>
                    <div className="form-check form-switch mb-3 p-3 bg-light rounded-3 ms-0">
                      <input
                        type="checkbox"
                        name="allow_new_registrations"
                        checked={settings.allow_new_registrations}
                        onChange={handleInputChange}
                        className="form-check-input ms-0 me-3 fs-5"
                        id="regSwitch"
                      />
                      <label className="form-check-label fw-semibold text-dark" htmlFor="regSwitch">
                        Allow Public Customer Registrations
                      </label>
                    </div>

                    <div className="form-check form-switch mb-4 p-3 bg-warning-subtle text-warning-emphasis rounded-3 ms-0">
                      <input
                        type="checkbox"
                        name="maintenance_mode"
                        checked={settings.maintenance_mode}
                        onChange={handleInputChange}
                        className="form-check-input ms-0 me-3 fs-5"
                        id="maintSwitch"
                      />
                      <label className="form-check-label fw-semibold text-dark" htmlFor="maintSwitch">
                        Enable Maintenance Mode (Restricts non-admin user access)
                      </label>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-medium">Timezone</label>
                        <select
                          name="timezone"
                          value={settings.timezone}
                          onChange={handleInputChange}
                          className="form-select rounded-3"
                        >
                          <option value="UTC">UTC (Universal Coordinated Time)</option>
                          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                          <option value="America/New_York">America/New_York (EST)</option>
                          <option value="Europe/London">Europe/London (GMT)</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-medium">Date Format</label>
                        <select
                          name="date_format"
                          value={settings.date_format}
                          onChange={handleInputChange}
                          className="form-select rounded-3"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" disabled={saving} className="btn btn-primary rounded-3 px-4 fw-semibold">
                      {saving ? "Saving..." : <><Save size={16} className="me-2" /> Save System Presets</>}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Right Column: Platform Status Summary */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <h6 className="fw-bold text-dark mb-3">Platform Overview</h6>
                <div className="d-flex align-items-center mb-3">
                  <CheckCircle className="text-success me-2" size={18} />
                  <span className="small text-muted">Core Engine: <strong className="text-success">Active & Online</strong></span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <Shield className="text-primary me-2" size={18} />
                  <span className="small text-muted">Role: <strong className="text-dark">Administrator</strong></span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <Mail className="text-info me-2" size={18} />
                  <span className="small text-muted">SMTP Email Status: <strong className="text-dark">{settings.email_notifications_enabled ? "Enabled" : "Disabled"}</strong></span>
                </div>
                <hr />
                <div className="small text-muted mb-2">
                  <strong>Version:</strong> Subly Platform v2.4.0 (Enterprise)
                </div>
                <div className="small text-muted">
                  <strong>Last Settings Sync:</strong> {settings.updated_at ? new Date(settings.updated_at).toLocaleTimeString() : "Just now"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}