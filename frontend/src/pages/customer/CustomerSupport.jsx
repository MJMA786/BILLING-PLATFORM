import { useState } from "react";
import { Zap, Mail, Clock, Send, CheckCircle2, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import supportService from "../../services/supportService";

function CustomerSupport() {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState("");
  const [ticket, setTicket] = useState({
    subject: "",
    category: "Billing & Payments",
    priority: "Medium",
    message: "",
  });

  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await supportService.submitTicket(ticket);
      setTicketRef(res.ticket_ref || `TICKET-#${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
      showToast(res.message || "Support ticket submitted and confirmation email sent!", "success");
    } catch (err) {
      showToast(err.response?.data?.detail || "Failed to submit support request. Please try again.", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setTicket({
      subject: "",
      category: "Billing & Payments",
      priority: "Medium",
      message: "",
    });
    setTicketRef("");
    setSubmitted(false);
  };

  const faqs = [
    {
      q: "How do I upgrade or downgrade my active subscription?",
      a: "Navigate to 'Available Plans' or 'My Subscription' in your customer dashboard, select the new plan, and complete checkout. Your billing cycle will adjust automatically.",
    },
    {
      q: "When will I receive my GST/Tax PDF invoice?",
      a: "PDF receipts are generated instantly upon every successful payment. You can view, print, or download statements from the 'My Invoices' section.",
    },
    {
      q: "What payment methods are accepted?",
      a: "We support Credit Cards, Debit Cards, Net Banking, and UPI payments via our automated checkout gateway.",
    },
    {
      q: "How do I cancel auto-renewal?",
      a: "In 'My Subscription', click 'Cancel Plan'. Your subscription will remain active until the end of your current billing period without renewing.",
    },
  ];

  return (
    <div className="customer-support py-2">
      {/* Clean Header */}
      <div className="card border shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1.5 fw-bold micro-text mb-2">
              <Zap size={14} className="me-1" /> Customer Help & Ticket Desk
            </span>
            <h2 className="fw-bold text-dark mb-1 font-display fs-3">
              Help & Customer Support Desk
            </h2>
            <p className="text-secondary mb-0 small fw-medium">
              Have questions about your subscription, invoices, or billing? Reach out to our 24/7 priority support team.
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Form */}
        <div className="col-lg-7">
          <div className="card border border-slate-200 shadow-sm rounded-4 bg-white h-100">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
              <h5 className="fw-bold text-dark font-display mb-1">Submit a Support Ticket</h5>
              <small className="text-secondary fw-medium">Our support engineers typically respond within 2 hours.</small>
            </div>

            <div className="card-body p-4">
              {submitted ? (
                <div className="text-center py-5">
                  <div className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3">
                    <CheckCircle2 size={42} />
                  </div>
                  <h4 className="fw-bold text-dark font-display mb-1">Support Ticket Submitted & Emailed!</h4>
                  <p className="text-secondary small max-w-md mx-auto mb-4 fw-medium">
                    Thank you for reaching out. Ticket reference code <strong>{ticketRef}</strong> has been created and an email confirmation was dispatched to your account email address.
                  </p>
                  <button className="btn btn-outline-primary rounded-3 px-4 py-2 fw-bold small" onClick={handleReset}>
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark mb-1">Category</label>
                      <select
                        className="form-select shadow-none small font-display"
                        value={ticket.category}
                        onChange={(e) => setTicket({ ...ticket, category: e.target.value })}
                      >
                        <option value="Billing & Payments">Billing & Payments</option>
                        <option value="Subscription Upgrade">Subscription & Plan Change</option>
                        <option value="Technical Issue">Technical & Portal Issue</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark mb-1">Priority Level</label>
                      <select
                        className="form-select shadow-none small font-display"
                        value={ticket.priority}
                        onChange={(e) => setTicket({ ...ticket, priority: e.target.value })}
                      >
                        <option value="Low">Low - Normal Inquiry</option>
                        <option value="Medium">Medium - Standard Request</option>
                        <option value="High">High - Urgent Assistance</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-dark mb-1">Subject</label>
                      <input
                        type="text"
                        className="form-control shadow-none small font-display"
                        placeholder="Brief summary of your billing or subscription question..."
                        required
                        value={ticket.subject}
                        onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-dark mb-1">Detailed Message</label>
                      <textarea
                        className="form-control shadow-none small font-display"
                        rows="5"
                        placeholder="Provide details about your query or invoice issue..."
                        required
                        value={ticket.message}
                        onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                      ></textarea>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 border-top">
                    <button
                      type="submit"
                      className="btn btn-primary px-4 py-2.5 rounded-3 fw-bold small shadow-sm d-inline-flex align-items-center gap-2"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1"></span>
                          Sending Ticket Email...
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Submit Support Request
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Right Info & FAQ */}
        <div className="col-lg-5">
          {/* Direct Contact Card */}
          <div className="card border border-slate-200 shadow-sm rounded-4 bg-white mb-4">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
              <h5 className="fw-bold text-dark font-display mb-1">Direct Support Channels</h5>
              <small className="text-secondary fw-medium">Get in touch with customer care.</small>
            </div>

            <div className="card-body p-4 d-grid gap-3">
              <div className="d-flex align-items-center p-3 border border-slate-200 rounded-3 bg-light">
                <div className="bg-primary-subtle text-primary p-2.5 rounded-circle me-3 flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <small className="text-muted micro-text fw-bold text-uppercase d-block mb-0.5">Support Email</small>
                  <strong className="text-dark small font-monospace">support@subly.com</strong>
                </div>
              </div>

              <div className="d-flex align-items-center p-3 border border-slate-200 rounded-3 bg-light">
                <div className="bg-success-subtle text-success p-2.5 rounded-circle me-3 flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <small className="text-muted micro-text fw-bold text-uppercase d-block mb-0.5">Operating Hours</small>
                  <strong className="text-dark small">24/7 Priority Support Desk</strong>
                </div>
              </div>

              <div className="d-flex align-items-center p-3 border border-slate-200 rounded-3 bg-light">
                <div className="bg-info-subtle text-info p-2.5 rounded-circle me-3 flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <small className="text-muted micro-text fw-bold text-uppercase d-block mb-0.5">Guaranteed SLA</small>
                  <strong className="text-dark small">Response within 2 hours</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ Accordion */}
          <div className="card border border-slate-200 shadow-sm rounded-4 bg-white">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
              <h5 className="fw-bold text-dark font-display mb-1">Frequently Asked Questions</h5>
              <small className="text-secondary fw-medium">Instant answers to common inquiries.</small>
            </div>

            <div className="card-body p-4">
              <div className="d-grid gap-2">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-slate-200 rounded-3 overflow-hidden bg-light">
                    <button
                      className="w-100 text-start bg-light border-0 p-3 fw-bold small text-dark d-flex justify-content-between align-items-center"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    >
                      <span className="pe-2">{faq.q}</span>
                      {openFaq === index ? <ChevronUp size={16} className="text-primary flex-shrink-0" /> : <ChevronDown size={16} className="text-muted flex-shrink-0" />}
                    </button>
                    {openFaq === index && (
                      <div className="p-3 pt-0 text-secondary small border-top border-slate-200 bg-white fw-medium">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerSupport;
