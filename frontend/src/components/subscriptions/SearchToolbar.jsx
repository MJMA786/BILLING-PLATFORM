import { Search, Plus } from "lucide-react";

export default function SearchToolbar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onCreate,
}) {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">

      <div className="card-body">

        <div className="row g-3 align-items-center">

          {/* Search */}

          <div className="col-lg-5">

            <div className="input-group">

              <span className="input-group-text bg-white border-end-0">

                <Search size={18} />

              </span>

              <input
                type="text"
                className="form-control border-start-0 shadow-none"
                placeholder="Search customer, email or plan..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>

          </div>

          {/* Status */}

          <div className="col-lg-3">

            <select
              className="form-select shadow-none"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="trial">
                Trial
              </option>

              <option value="past_due">
                Past Due
              </option>

              <option value="cancelled">
                Cancelled
              </option>

            </select>

          </div>

          {/* Button */}

          <div className="col-lg-4 text-lg-end">

            <button
              className="btn btn-primary rounded-3 fw-semibold px-4"
              onClick={onCreate}
            >
              <Plus
                size={18}
                className="me-2"
              />

              Assign Subscription

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}