function CustomerTable({ customers, onEdit, onDelete }) {
  if (customers.length === 0) {
    return (
      <div className="alert alert-info">
        No customers found.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover shadow-sm align-middle">

        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Country</th>
            <th>Created</th>
            <th className="text-center" width="180">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>

              <td>{customer.id}</td>

              <td>{customer.name}</td>

              <td>{customer.email}</td>

              <td>{customer.billing_country}</td>

              <td>
                {new Date(customer.created_at).toLocaleDateString()}
              </td>

              <td className="text-center">

                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => onEdit(customer)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(customer)}
                >
                  Delete
                </button>

              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default CustomerTable;