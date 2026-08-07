import { Eye } from "lucide-react";

function BillingCycleTable({
  billingCycles,
  onView,
}) {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span className="badge bg-warning text-dark">
            Pending
          </span>
        );

      case "invoiced":
        return (
          <span className="badge bg-primary">
            Invoiced
          </span>
        );

      case "completed":
        return (
          <span className="badge bg-success">
            Completed
          </span>
        );

      default:
        return (
          <span className="badge bg-secondary">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4">

      <div className="card-header bg-white border-0">

        <h5 className="fw-bold mb-0">
          Billing Cycles
        </h5>

      </div>

      <div className="table-responsive">

        <table className="table align-middle mb-0">

          <thead className="table-light">

            <tr>

              <th>ID</th>

              <th>Customer</th>

              <th>Plan</th>

              <th>Cycle Start</th>

              <th>Cycle End</th>

              <th>Status</th>

              <th className="text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {billingCycles.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="text-center py-4"
                >

                  No billing cycles found.

                </td>

              </tr>

            ) : (

              billingCycles.map((cycle) => (

                <tr key={cycle.id}>

                  <td>

                    #{cycle.id}

                  </td>

                  <td>

                    {cycle.subscription?.customer?.name ||
                      "-"}

                  </td>

                  <td>

                    {cycle.subscription?.plan?.name ||
                      "-"}

                  </td>

                  <td>

                    {new Date(
                      cycle.cycle_start
                    ).toLocaleDateString()}

                  </td>

                  <td>

                    {new Date(
                      cycle.cycle_end
                    ).toLocaleDateString()}

                  </td>

                  <td>

                    {getStatusBadge(
                      cycle.status
                    )}

                  </td>

                  <td className="text-center">

                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() =>
                        onView(cycle)
                      }
                    >

                      <Eye size={16} />

                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default BillingCycleTable;