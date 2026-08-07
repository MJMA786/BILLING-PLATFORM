export default function PaymentStats({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "primary",
}) {
  return (
    <div className="card border border-slate-200 shadow-sm rounded-4 h-100 bg-white">
      <div className="card-body p-3.5">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <small className="text-muted micro-text fw-bold text-uppercase d-block mb-1">
              {title}
            </small>
            <h3 className="fw-bold text-dark font-display mb-1">
              {value}
            </h3>
            <small className="text-secondary micro-text fw-medium">
              {subtitle}
            </small>
          </div>

          <div
            className={`bg-${color}-subtle text-${color} rounded-3 d-flex align-items-center justify-content-center flex-shrink-0`}
            style={{
              width: 50,
              height: 50,
            }}
          >
            <Icon size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}