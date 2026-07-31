function PlanTable({

    plans,

    onEdit,

    onDeactivate,

}) {

    if (plans.length === 0) {

        return (

            <div className="empty-state">

                <i className="bi bi-box-seam-fill"></i>

                <h5>No Plans Found</h5>

                <p>

                    Create your first subscription plan.

                </p>

            </div>

        );

    }

    return (

        <>

            <div className="customer-table-header">

                <h5>

                    Subscription Plans

                </h5>

                <span>

                    {plans.length} Plans

                </span>

            </div>

            <div className="table-responsive">

                <table className="table customer-table align-middle mb-0">

                    <thead>

                        <tr>

                            <th>Plan</th>

                            <th>Price</th>

                            <th>Interval</th>

                            <th>Status</th>

                            <th className="text-center">

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            plans.map((plan) => (

                                <tr key={plan.id}>

                                    <td>

                                        <div className="customer-info">

                                            <div className="customer-avatar">

                                                <i className="bi bi-box-seam-fill"></i>

                                            </div>

                                            <div>

                                                <h6>

                                                    {plan.name}

                                                </h6>

                                                <small>

                                                    {plan.description}

                                                </small>

                                            </div>

                                        </div>

                                    </td>

                                    <td>

                                        <strong>

                                            ₹{Number(plan.price).toFixed(2)}

                                        </strong>

                                    </td>

                                    <td>

                                        <span

                                            className={`country-badge ${

                                                plan.interval === "monthly"

                                                    ? "monthly"

                                                    : "annual"

                                            }`}

                                        >

                                            {

                                                plan.interval.charAt(0).toUpperCase()

                                                +

                                                plan.interval.slice(1)

                                            }

                                        </span>

                                    </td>

                                    <td>

                                        {

                                            plan.active ? (

                                                <span className="status-active">

                                                    Active

                                                </span>

                                            ) : (

                                                <span className="status-inactive">

                                                    Inactive

                                                </span>

                                            )

                                        }

                                    </td>

                                    <td className="text-center">

                                        <button

                                            className="btn btn-light btn-action me-2"

                                            onClick={() => onEdit(plan)}

                                        >

                                            <i className="bi bi-pencil-square"></i>

                                        </button>

                                        {

                                            plan.active && (

                                                <button

                                                    className="btn btn-light btn-action btn-delete"

                                                    onClick={() =>

                                                        onDeactivate(plan.id)

                                                    }

                                                >

                                                    <i className="bi bi-x-circle"></i>

                                                </button>

                                            )

                                        }

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </>

    );

}

export default PlanTable;