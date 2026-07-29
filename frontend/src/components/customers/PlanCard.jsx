function PlanCard({ plan }) {
  return (
    <div className="card shadow h-100">

      <div className="card-body">

        <h4 className="card-title">
          {plan.name}
        </h4>

        <p className="text-muted">
          {plan.description}
        </p>

        <h3 className="text-primary mb-3">
          ₹{Number(plan.price).toFixed(2)}
        </h3>

        <p className="mb-3">
          <strong>Billing:</strong>{" "}
          <span className="text-capitalize">
            {plan.interval}
          </span>
        </p>

        <span className="badge bg-success mb-3">
          Available
        </span>

        <div className="d-grid">
          <button
            className="btn btn-primary"
            onClick={() =>
              alert("Subscription module coming soon!")
            }
          >
            Choose Plan
          </button>
        </div>

      </div>

    </div>
  );
}

export default PlanCard;