import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

function PlanTable({
  plans,
  onEdit,
  onDeactivate,
  onActivate,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [intervalFilter, setIntervalFilter] =
    useState("All");

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        (plan.name || "")
          .toLowerCase()
          .includes(search) ||
        (plan.description || "")
          .toLowerCase()
          .includes(search);

      const matchesInterval =
        intervalFilter === "All" ||
        plan.billing_interval ===
          intervalFilter;

      return (
        matchesSearch &&
        matchesInterval
      );
    });
  }, [
    plans,
    searchTerm,
    intervalFilter,
  ]);

  if (plans.length === 0) {
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body text-center py-5">
          <i className="bi bi-box-seam display-5 text-primary mb-3"></i>

          <h5 className="fw-bold">
            No Plans Available
          </h5>

          <p className="text-muted mb-0">
            Create your first
            subscription plan to get
            started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

      {/* Search & Filter */}

      <div className="card-header bg-white border-bottom py-3">
        <div className="row align-items-center g-3">

          <div className="col-lg-7">
            <div className="input-group">

              <span className="input-group-text bg-white border-end-0">
                <Search size={18} />
              </span>

              <input
                type="text"
                className="form-control border-start-0 shadow-none"
                placeholder="Search plan by name or description..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </div>
          </div>

          <div className="col-lg-5">
            <select
              className="form-select shadow-none"
              value={intervalFilter}
              onChange={(e) =>
                setIntervalFilter(
                  e.target.value
                )
              }
            >
              <option value="All">
                All Intervals
              </option>

              <option value="monthly">
                Monthly
              </option>

              <option value="annual">
                Annual
              </option>
            </select>
          </div>

        </div>
      </div>

      {/* Plans Table */}

      <div className="table-responsive">

        <table className="table align-middle table-hover mb-0">

          <thead className="table-light">

            <tr>

              <th
                className="ps-4"
                style={{
                  width: "38%",
                }}
              >
                Plan Details
              </th>

              <th
                style={{
                  width: "18%",
                }}
              >
                Pricing
              </th>

              <th
                style={{
                  width: "18%",
                }}
              >
                Billing
              </th>

              <th
                style={{
                  width: "12%",
                }}
              >
                Status
              </th>

              <th
                className="text-center"
                style={{
                  width: "14%",
                }}
              >
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredPlans.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center py-5 text-muted"
                >
                  No matching plans found.
                </td>

              </tr>

            ) : (

              filteredPlans.map(
                (plan) => (

                  <tr
                    key={plan.id}
                    className="align-middle"
                  >

                    {/* Plan Details */}

                    <td className="ps-4 py-4">

                      <div className="d-flex align-items-start gap-3">

                        <div
                          className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center shadow-sm"
                          style={{
                            width: 52,
                            height: 52,
                            minWidth: 52,
                          }}
                        >
                          <i className="bi bi-box-seam-fill fs-5"></i>
                        </div>

                        <div className="flex-grow-1">

                          <h5 className="fw-bold mb-1">
                            {plan.name}
                          </h5>

                          <p className="text-muted mb-1 small">
                            {plan.description}
                          </p>

                          <small className="text-secondary">
                            #{plan.slug}
                          </small>

                        </div>

                      </div>

                    </td>
                                        {/* Pricing */}

                    <td>

                      <div className="fw-bold fs-5 text-dark">
                        {formatCurrency(plan.price)}
                      </div>

                      <small className="text-muted">
                        {plan.currency}
                      </small>

                    </td>

                    {/* Billing */}

                    <td>

                      <div className="d-flex flex-column gap-2">

                        <span
                          className={`badge px-3 py-2 rounded-pill fw-semibold ${
                            plan.billing_interval === "monthly"
                              ? "bg-info-subtle text-info"
                              : "bg-warning-subtle text-warning"
                          }`}
                          style={{
                            width: "fit-content",
                          }}
                        >
                          <i className="bi bi-calendar-event me-1"></i>

                          {plan.billing_interval === "monthly"
                            ? "Monthly"
                            : "Annual"}
                        </span>

                        <small className="text-muted">
                          <i className="bi bi-hourglass-split me-1"></i>

                          {plan.trial_days > 0
                            ? `${plan.trial_days} Day Trial`
                            : "No Trial"}
                        </small>

                      </div>

                    </td>

                    {/* Status */}

                    <td>

                      {plan.is_active ? (
                        <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2 fw-semibold">
                          <i className="bi bi-check-circle-fill me-1"></i>
                          Active
                        </span>
                      ) : (
                        <span className="badge rounded-pill bg-secondary-subtle text-secondary px-3 py-2 fw-semibold">
                          <i className="bi bi-pause-circle-fill me-1"></i>
                          Inactive
                        </span>
                      )}

                    </td>

                    {/* Actions */}

                    <td className="text-center">

                      <div className="d-flex justify-content-center gap-2">

                        <button
                          className="btn btn-outline-primary btn-sm rounded-3 px-3"
                          title="Edit Plan"
                          onClick={() => onEdit(plan)}
                        >
                          <i className="bi bi-pencil-square me-1"></i>
                          Edit
                        </button>

                        {plan.is_active ? (
                          <button
                            className="btn btn-outline-danger btn-sm rounded-3 px-3"
                            title="Deactivate Plan"
                            onClick={() =>
                              onDeactivate(plan.id)
                            }
                          >
                            <i className="bi bi-pause-circle me-1"></i>
                            Archive
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-success btn-sm rounded-3 px-3"
                            title="Activate Plan"
                            onClick={() =>
                              onActivate(plan.id)
                            }
                          >
                            <i className="bi bi-play-circle me-1"></i>
                            Activate
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>
                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default PlanTable;