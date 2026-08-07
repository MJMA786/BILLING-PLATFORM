import { Search, X, RotateCcw, Download } from "lucide-react";

export default function PaymentToolbar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
  onResetFilters,
  onExportCSV,
  onRefresh,
}) {
  const isFiltered = searchTerm.trim() !== "" || statusFilter !== "All" || methodFilter !== "All";

  return (
    <div className="card border border-slate-200 shadow-sm rounded-4 mb-4 bg-white">
      <div className="card-body p-3">
        <div className="row g-3 align-items-center">
          {/* Search Box */}
          <div className="col-lg-5 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted ps-3">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 border-end-0 ps-2 shadow-none small font-display"
                placeholder="Search by invoice #, transaction ref, method, or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="input-group-text bg-white border-start-0 text-muted cursor-pointer pe-3"
                  onClick={() => setSearchTerm("")}
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="col-lg-3 col-md-3">
            <select
              className="form-select shadow-none small fw-medium"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="succeeded">Succeeded / Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="col-lg-2 col-md-3">
            <select
              className="form-select shadow-none small fw-medium"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              <option value="All">All Methods</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net Banking</option>
            </select>
          </div>

          {/* Actions */}
          <div className="col-lg-2 d-flex justify-content-end gap-2">
            {isFiltered && (
              <button
                className="btn btn-outline-secondary btn-sm rounded-3 px-2.5 py-2 micro-text fw-bold d-flex align-items-center gap-1"
                onClick={onResetFilters}
                title="Reset Filters"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}

            <button
              className="btn btn-primary btn-sm rounded-3 px-3 py-2 micro-text fw-bold d-flex align-items-center gap-1.5 shadow-sm"
              onClick={onExportCSV}
              title="Export CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}