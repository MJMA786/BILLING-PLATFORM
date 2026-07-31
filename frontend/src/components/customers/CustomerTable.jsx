function CustomerTable({ customers, onEdit, onDelete }) {

    if (customers.length === 0) {

        return (

            <div className="empty-state">

                <i className="bi bi-people-fill"></i>

                <h5>No Customers Found</h5>

                <p>

                    Customers will appear here after registration.

                </p>

            </div>

        );

    }

    return (

        <div className="customer-table-card">

            <div className="customer-table-header">

                <h5>

                    Customer Directory

                </h5>

                <span>

                    {customers.length} Customers

                </span>

            </div>

            <div className="table-responsive">

                <table className="table customer-table align-middle mb-0">

                    <thead>

                        <tr>

                            <th>Customer</th>

                            <th>Email</th>

                            <th>Country</th>

                            <th>Created</th>

                            <th className="text-center">

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            customers.map((customer) => (

                                <tr key={customer.id}>

                                    <td>

                                        <div className="customer-info">

                                            <div className="customer-avatar">

                                                {

                                                    customer.name

                                                        .charAt(0)

                                                        .toUpperCase()

                                                }

                                            </div>

                                            <div>

                                                <h6>

                                                    {customer.name}

                                                </h6>

                                                <small>

                                                    ID #{customer.id}

                                                </small>

                                            </div>

                                        </div>

                                    </td>

                                    <td>

                                        {customer.email}

                                    </td>

                                    <td>

                                        <span className="country-badge">

                                            {

                                                customer.billing_country

                                            }

                                        </span>

                                    </td>

                                    <td>

                                        {

                                            new Date(

                                                customer.created_at

                                            ).toLocaleDateString(

                                                "en-IN",

                                                {

                                                    day: "2-digit",

                                                    month: "short",

                                                    year: "numeric",

                                                }

                                            )

                                        }

                                    </td>

                                    <td className="text-center">

                                        <button

                                            className="btn btn-light btn-action me-2"

                                            onClick={() => onEdit(customer)}

                                        >

                                            <i className="bi bi-pencil-square"></i>

                                        </button>

                                        <button

                                            className="btn btn-light btn-action btn-delete"

                                            onClick={() => onDelete(customer)}

                                        >

                                            <i className="bi bi-trash3"></i>

                                        </button>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default CustomerTable;