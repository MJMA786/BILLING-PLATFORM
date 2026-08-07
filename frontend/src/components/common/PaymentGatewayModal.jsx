import { useState } from "react";
import { Modal } from "react-bootstrap";
import { CreditCard, QrCode, Building2, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import paymentService from "../../services/paymentService";
import { formatCurrency } from "../../utils/formatters";

export default function PaymentGatewayModal({
  show,
  onClose,
  plan = null,
  invoice = null,
  onSuccess,
}) {
  const [activeTab, setActiveTab] = useState("card"); // 'card', 'upi', 'netbanking'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);

  // Card Form State
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8892");
  const [cardName, setCardName] = useState("John Doe");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("789");

  // UPI State
  const [upiId, setUpiId] = useState("customer@okaxis");

  // Bank State
  const [bank, setBank] = useState("HDFC Bank");

  if (!show) return null;

  // Calculate pricing breakdown
  const itemTitle = plan ? `${plan.name} Plan` : invoice ? `Invoice #${invoice.invoice_number}` : "Subscription Plan";
  const subtotal = plan ? Number(plan.price || 0) : invoice ? Number(invoice.subtotal || invoice.total || 0) : 0;
  const taxAmount = plan ? subtotal * 0.18 : invoice ? Number(invoice.tax_amount || 0) : 0;
  const totalAmount = plan ? subtotal + taxAmount : invoice ? Number(invoice.total || 0) : subtotal + taxAmount;

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        payment_method: activeTab,
        ...(plan && { plan_id: plan.id }),
        ...(invoice && { invoice_id: invoice.id }),
      };

      const result = await paymentService.processCheckout(payload);
      setSuccessData(result);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      setError(err.response?.data?.detail || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessData(null);
    setError("");
    setLoading(false);
    onClose();
  };

  return (
    <Modal show={show} onHide={handleResetAndClose} centered size="lg" backdrop="static">
      <div className="modal-content border-0 shadow-lg overflow-hidden" style={{ borderRadius: "20px" }}>
        
        {/* Header */}
        <div className="bg-primary text-white p-4 d-flex justify-content-between align-items-center">
          <div>
            <span className="badge bg-white text-primary px-3 py-1.5 rounded-pill fw-semibold mb-1">
              Subly Payment Gateway
            </span>
            <h5 className="fw-bold mb-0 text-white">
              {successData ? "Transaction Complete" : "Secure Payment Checkout"}
            </h5>
          </div>

          <div className="d-flex align-items-center gap-1 small bg-primary-subtle text-primary-emphasis px-3 py-1.5 rounded-pill">
            <Lock size={14} className="text-white" />
            <span className="text-white font-monospace small">256-bit SSL Encrypted</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body p-4">
          {successData ? (
            /* Success Screen View */
            <div className="text-center py-4">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center bg-success-subtle rounded-circle"
                style={{ width: 88, height: 88 }}
              >
                <CheckCircle2 size={56} className="text-success" />
              </div>

              <h4 className="fw-bold text-dark mb-1">Payment Successful! 🎉</h4>
              <p className="text-muted mb-4">
                Your payment of <strong>{formatCurrency(successData.amount)}</strong> has been processed successfully.
              </p>

              <div className="card border-0 bg-light rounded-4 p-4 text-start mb-4 mx-auto" style={{ maxWidth: 460 }}>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Transaction Ref:</span>
                  <span className="fw-bold font-monospace text-primary">{successData.gateway_reference}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Item / Plan:</span>
                  <span className="fw-bold text-dark">{successData.plan_name}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Invoice #:</span>
                  <span className="fw-semibold text-dark">{successData.invoice_number}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Status:</span>
                  <span className="badge bg-success px-2.5 py-1">PAID & ACTIVATED</span>
                </div>
              </div>

              <div className="alert alert-success border-0 bg-success-subtle text-success small mb-4 mx-auto" style={{ maxWidth: 460 }}>
                ✉️ A payment receipt and plan confirmation email has been sent to your registered email address!
              </div>

              <button
                className="btn btn-primary btn-lg rounded-pill px-5 fw-semibold shadow-sm"
                onClick={handleResetAndClose}
              >
                Continue to Portal
              </button>
            </div>
          ) : (
            /* Checkout View */
            <div className="row g-4">
              
              {/* Order Summary Column */}
              <div className="col-md-5">
                <div className="card border-0 bg-light rounded-4 p-4 h-100">
                  <h6 className="fw-bold text-uppercase text-muted small mb-3">Order Summary</h6>
                  
                  <div className="mb-3">
                    <h5 className="fw-bold text-dark mb-1">{itemTitle}</h5>
                    <span className="badge bg-primary-subtle text-primary rounded-pill">
                      Instant Activation
                    </span>
                  </div>

                  <hr className="my-3 border-secondary-subtle" />

                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>Base Amount</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>GST / Tax (18%)</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>

                  <hr className="my-3 border-secondary-subtle" />

                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark">Total Amount</span>
                    <h4 className="fw-bold text-success mb-0">{formatCurrency(totalAmount)}</h4>
                  </div>

                  <div className="mt-4 pt-3 border-top text-muted small">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <CheckCircle2 size={16} className="text-success" />
                      <span>Automatic Subscription Update</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <CheckCircle2 size={16} className="text-success" />
                      <span>Instant Email Confirmation</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method & Form Column */}
              <div className="col-md-7">
                {error && (
                  <div className="alert alert-danger border-0 d-flex align-items-center gap-2 py-2 px-3 mb-3">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Tabs */}
                <div className="nav nav-pills nav-justified bg-light p-1 rounded-3 mb-4">
                  <button
                    type="button"
                    className={`nav-link rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${activeTab === "card" ? "active bg-primary text-white shadow-sm" : "text-muted"}`}
                    onClick={() => setActiveTab("card")}
                  >
                    <CreditCard size={18} /> Card
                  </button>
                  <button
                    type="button"
                    className={`nav-link rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${activeTab === "upi" ? "active bg-primary text-white shadow-sm" : "text-muted"}`}
                    onClick={() => setActiveTab("upi")}
                  >
                    <QrCode size={18} /> UPI / QR
                  </button>
                  <button
                    type="button"
                    className={`nav-link rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${activeTab === "netbanking" ? "active bg-primary text-white shadow-sm" : "text-muted"}`}
                    onClick={() => setActiveTab("netbanking")}
                  >
                    <Building2 size={18} /> NetBanking
                  </button>
                </div>

                <form onSubmit={handleProcessPayment}>
                  {/* Card Tab */}
                  {activeTab === "card" && (
                    <div className="d-flex flex-column gap-3">
                      <div>
                        <label className="form-label small fw-semibold text-muted">Cardholder Name</label>
                        <input
                          type="text"
                          className="form-control shadow-none rounded-3"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label small fw-semibold text-muted">Card Number</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white text-muted">
                            <CreditCard size={18} />
                          </span>
                          <input
                            type="text"
                            className="form-control shadow-none rounded-end-3"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="row g-2">
                        <div className="col-6">
                          <label className="form-label small fw-semibold text-muted">Expiry Date</label>
                          <input
                            type="text"
                            className="form-control shadow-none rounded-3"
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label small fw-semibold text-muted">CVV</label>
                          <input
                            type="password"
                            maxLength="4"
                            className="form-control shadow-none rounded-3"
                            placeholder="•••"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* UPI Tab */}
                  {activeTab === "upi" && (
                    <div className="d-flex flex-column gap-3">
                      <div>
                        <label className="form-label small fw-semibold text-muted">Enter Virtual Payment Address (VPA)</label>
                        <input
                          type="text"
                          className="form-control shadow-none rounded-3"
                          placeholder="e.g. username@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          required
                        />
                        <div className="form-text">Instant verification via GPay, PhonePe, Paytm, or BHIM.</div>
                      </div>
                      <div className="border rounded-4 p-3 bg-light text-center">
                        <QrCode size={48} className="text-primary mb-2" />
                        <p className="small text-muted mb-0">Or scan standard UPI QR code at payment terminal</p>
                      </div>
                    </div>
                  )}

                  {/* NetBanking Tab */}
                  {activeTab === "netbanking" && (
                    <div className="d-flex flex-column gap-3">
                      <div>
                        <label className="form-label small fw-semibold text-muted">Select Bank</label>
                        <select
                          className="form-select shadow-none rounded-3"
                          value={bank}
                          onChange={(e) => setBank(e.target.value)}
                          required
                        >
                          <option value="HDFC Bank">HDFC Bank</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="State Bank of India">State Bank of India (SBI)</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-2 d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-3 px-4"
                      onClick={handleResetAndClose}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary rounded-3 flex-grow-1 fw-bold py-2.5 shadow-sm d-flex align-items-center justify-content-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Lock size={16} /> Pay {formatCurrency(totalAmount)} Now
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}
        </div>

      </div>
    </Modal>
  );
}
