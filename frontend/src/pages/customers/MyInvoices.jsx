function MyInvoices() {
  return (
    <div className="container-fluid">

      <h1 className="mb-4">
        My Invoices
      </h1>

      <div className="card border-0 shadow-sm rounded-4">

        <div className="card-body">

          <table className="table align-middle">

            <thead>

              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              <tr>
                <td>INV-1001</td>
                <td>01 Jul 2026</td>
                <td>$29.00</td>

                <td>
                  <span className="badge bg-success">
                    Paid
                  </span>
                </td>
              </tr>

              <tr>
                <td>INV-1002</td>
                <td>01 Aug 2026</td>
                <td>$29.00</td>

                <td>
                  <span className="badge bg-warning text-dark">
                    Pending
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

export default MyInvoices;