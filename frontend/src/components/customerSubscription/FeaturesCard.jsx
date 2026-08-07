import { CheckCircle2, FileText, Receipt, BarChart3, ShieldCheck, Users, Headphones, Check } from "lucide-react";

export default function FeaturesCard({ subscription }) {
  if (!subscription) return null;

  const plan = subscription.plan || subscription.subscription_plan || {};

  const defaultFeatures = [
    { icon: FileText, title: "Unlimited Invoices", description: "Automated PDF generation & email dispatch", color: "primary" },
    { icon: Receipt, title: "Tax & GST Billing", description: "Configurable platform tax calculations", color: "success" },
    { icon: BarChart3, title: "Analytics & Reports", description: "Real-time revenue & subscription metrics", color: "warning" },
    { icon: ShieldCheck, title: "Secure API Access", description: "RESTful integration endpoints & keys", color: "info" },
    { icon: Users, title: "Customer Portal", description: "Self-service billing & payment gateway", color: "secondary" },
    { icon: Headphones, title: "24/7 Priority Support", description: "Direct customer assistance & ticketing", color: "primary" },
  ];

  return (
    <div className="card border shadow-sm rounded-4 h-100 bg-white">
      <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
        <h5 className="fw-bold text-dark font-display mb-1">Entitlements & Features</h5>
        <small className="text-secondary fw-medium">All capabilities included with your {plan.name || "active"} plan.</small>
      </div>

      <div className="card-body p-4">
        <div className="row g-3">
          {defaultFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div className="col-md-6" key={index}>
                <div className="border border-slate-200 rounded-3 p-3 h-100 bg-light">
                  <div className="d-flex align-items-start gap-2.5">
                    <div className={`p-2 rounded-circle bg-${feature.color}-subtle text-${feature.color} flex-shrink-0 mt-0.5`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark small mb-0.5">{feature.title}</h6>
                      <small className="text-muted micro-text d-block mb-1.5">{feature.description}</small>
                      <span className="badge bg-success-subtle text-success border border-success border-opacity-25 rounded-pill micro-text px-2 py-0.5 fw-bold">
                        <Check size={10} className="me-1" /> Included
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="alert alert-primary border-0 bg-primary-subtle text-primary small mb-0 mt-4 d-flex align-items-center rounded-3">
          <CheckCircle2 size={18} className="me-2 flex-shrink-0" />
          <span>
            <strong>{plan.name || "Plan"} Active:</strong> You currently have full access to all entitlements.
          </span>
        </div>
      </div>
    </div>
  );
}