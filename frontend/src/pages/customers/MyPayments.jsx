function MyPayments() {
  return (
    <div className="container-fluid">

      <h1 className="mb-4">
        My Payments
      </h1>

      <div className="card border-0 shadow-sm rounded-4">

        <div className="card-body">

          <h5 className="mb-4">
            Recent Payments
          </h5>

          <table className="table">

            <thead>

              <tr>
                <th>Date</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              <tr>
                <td>01 Aug 2026</td>
                <td>Credit Card</td>
                <td>$29.00</td>

                <td>
                  <span className="badge bg-success">
                    Successful
                  </span>
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default MyPayments;