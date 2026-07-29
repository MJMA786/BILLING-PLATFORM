function RecentInvoices({ invoices = [] }) {

    return (

        <div className="dashboard-widget">

            <div className="widget-header">

                <div>

                    <h5>Recent Invoices</h5>

                    <p>Latest generated invoices</p>

                </div>

            </div>

            <div className="invoice-list">

                {invoices.length === 0 ? (

                    <div className="empty-state">

                        <i className="bi bi-receipt"></i>

                        <p>No invoices available</p>

                    </div>

                ) : (

                    invoices.map((invoice) => (

                        <div
                            className="invoice-item"
                            key={invoice.id}
                        >

                            <div>

                                <h6>{invoice.invoice_number}</h6>

                                <small>

                                    {invoice.customer_name}

                                </small>

                            </div>

                            <div className="text-end">

                                <strong>

                                    ₹{Number(invoice.amount).toLocaleString("en-IN")}

                                </strong>

                                <br />

                                <span
                                    className={`badge ${
                                        invoice.status === "paid"
                                            ? "bg-success"
                                            : invoice.status === "open"
                                            ? "bg-warning text-dark"
                                            : "bg-secondary"
                                    }`}
                                >

                                    {invoice.status}

                                </span>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}

export default RecentInvoices;