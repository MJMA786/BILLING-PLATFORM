import { Users, CheckCircle2, Clock, XCircle } from "lucide-react";

export default function SubscriptionStats({ subscriptions }) {
  const totalCount = subscriptions.length;

  const activeCount = subscriptions.filter(
    (s) => s.status === "active"
  ).length;

  const trialCount = subscriptions.filter(
    (s) => s.status === "trial"
  ).length;

  const pastDueCount = subscriptions.filter(
    (s) => s.status === "past_due"
  ).length;

  const stats = [
    {
      title: "Total Subscriptions",
      value: totalCount,
      icon: <Users size={24} />,
      bg: "bg-primary-subtle",
      color: "text-primary",
    },
    {
      title: "Active Plans",
      value: activeCount,
      icon: <CheckCircle2 size={24} />,
      bg: "bg-success-subtle",
      color: "text-success",
    },
    {
      title: "Trial Users",
      value: trialCount,
      icon: <Clock size={24} />,
      bg: "bg-warning-subtle",
      color: "text-warning",
    },
    {
      title: "Past Due",
      value: pastDueCount,
      icon: <XCircle size={24} />,
      bg: "bg-danger-subtle",
      color: "text-danger",
    },
  ];

  return (
    <div className="row g-4 mb-4">
      {stats.map((stat, index) => (
        <div className="col-xl-3 col-md-6" key={index}>
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
            <div className="d-flex align-items-center">
              <div
                className={`${stat.bg} ${stat.color} rounded-3 p-3 me-3`}
              >
                {stat.icon}
              </div>

              <div>
                <small className="text-muted fw-medium d-block">
                  {stat.title}
                </small>

                <h4 className="fw-bold mb-0 text-dark">
                  {stat.value}
                </h4>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}