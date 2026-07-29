function PlanTable({
  plans,
  onEdit,
  onDeactivate,
}) {

  if (plans.length === 0) {
    return (
      <div className="alert alert-info">
        No plans found.
      </div>
    );
  }

  return (
    <table className="table table-striped table-hover shadow-sm">

      <thead className="table-dark">

        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Currency</th>
          <th>Interval</th>
          <th>Status</th>
          <th width="200">Actions</th>
        </tr>

      </thead>

      <tbody>

        {plans.map((plan) => (

          <tr key={plan.id}>

            <td>{plan.id}</td>

            <td>{plan.name}</td>

            <td>{plan.description}</td>

            <td>
              ₹{Number(plan.price).toFixed(2)}
            </td>

            <td>{plan.currency}</td>

            <td className="text-capitalize">
              {plan.interval}
            </td>

            <td>

              {plan.active ? (

                <span className="badge bg-success">
                  Active
                </span>

              ) : (

                <span className="badge bg-danger">
                  Inactive
                </span>

              )}

            </td>

            <td>

              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => onEdit(plan)}
              >
                Edit
              </button>

              {plan.active && (

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    onDeactivate(plan.id)
                  }
                >
                  Deactivate
                </button>

              )}

            </td>

          </tr>

        ))}

      </tbody>

    </table>
  );
}

export default PlanTable;