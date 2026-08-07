import { Link } from "react-router-dom";

function RecentCustomers({ customers = [] }) {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
        <div>
          <h5 className="fw-bold mb-0">
            <i className="bi bi-people-fill text-primary me-2"></i>
            Recent Customers
          </h5>
          <small className="text-muted">
            Latest registered customers
          </small>
        </div>

        <Link
          to="/customers"
          className="btn btn-sm btn-outline-primary rounded-pill"
        >
          View All
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Company</th>
              <th>Email</th>
              <th>Country</th>
              <th>Joined</th>
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-muted py-5"
                >
                  <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="fw-semibold">
                      {customer.company_name}
                    </div>
                  </td>

                  <td>{customer.billing_email}</td>

                  <td>{customer.country}</td>

                  <td>
                    {new Date(
                      customer.created_at
                    ).toLocaleDateString()}
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

export default RecentCustomers;