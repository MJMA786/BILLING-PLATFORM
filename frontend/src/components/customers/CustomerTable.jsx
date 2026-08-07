import { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { formatDate } from "../../utils/formatters";

function CustomerTable({
  customers,
  onEdit,
  onDelete,
  onView,
}) {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [countryFilter, setCountryFilter] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 8;

  // ==========================================
  // Country Filter
  // ==========================================

  const countries = useMemo(() => {
    const set = new Set(
      customers
        .map((c) => c.country)
        .filter(Boolean)
    );

    return ["All", ...Array.from(set)];
  }, [customers]);

  // ==========================================
  // Search
  // ==========================================

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        (customer.company_name || "")
          .toLowerCase()
          .includes(search) ||

        (customer.billing_email || "")
          .toLowerCase()
          .includes(search) ||

        (customer.contact_person || "")
          .toLowerCase()
          .includes(search) ||

        String(customer.id).includes(search);

      const matchesCountry =
        countryFilter === "All" ||
        customer.country === countryFilter;

      return (
        matchesSearch &&
        matchesCountry
      );
    });
  }, [
    customers,
    searchTerm,
    countryFilter,
  ]);

  // ==========================================
  // Pagination
  // ==========================================

  const totalPages =
    Math.ceil(
      filteredCustomers.length /
        itemsPerPage
    ) || 1;

  const paginatedCustomers =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        itemsPerPage;

      return filteredCustomers.slice(
        start,
        start + itemsPerPage
      );
    }, [
      filteredCustomers,
      currentPage,
    ]);

  return (
    <div className="card border-0 shadow-sm rounded-4">

      {/* Header */}

      <div className="card-header bg-white border-0 py-3">

        <div className="row g-3 align-items-center">

          <div className="col-md-6">

            <div className="input-group">

              <span className="input-group-text bg-white border-end-0">

                <Search size={18} />

              </span>

              <input
                type="text"
                className="form-control border-start-0 shadow-none"
                placeholder="Search company, email, contact person or ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(
                    e.target.value
                  );
                  setCurrentPage(1);
                }}
              />

            </div>

          </div>

          <div className="col-md-4">

            <select
              className="form-select shadow-none"
              value={countryFilter}
              onChange={(e) => {
                setCountryFilter(
                  e.target.value
                );
                setCurrentPage(1);
              }}
            >
              {countries.map(
                (country) => (
                  <option
                    key={country}
                    value={country}
                  >
                    {country === "All"
                      ? "All Countries"
                      : country}
                  </option>
                )
              )}
            </select>

          </div>

          <div className="col-md-2 text-md-end">

            <span className="badge bg-primary-subtle text-primary px-3 py-2 fw-semibold">

              {filteredCustomers.length} Total

            </span>

          </div>

        </div>

      </div>

      {/* Table */}

      <div className="table-responsive">

        <table className="table table-hover align-middle mb-0">

          <thead className="table-light">

            <tr>

              <th>Company</th>

              <th>Billing Email</th>

              <th>Contact</th>

              <th>Country</th>

              <th>Created</th>

              <th className="text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {paginatedCustomers.length ===
            0 ? (
              <tr>

                <td
                  colSpan="6"
                  className="text-center py-5 text-muted"
                >
                  No matching customers
                  found.
                </td>

              </tr>
            ) : (
              paginatedCustomers.map(
                (customer) => (
                  <tr
                    key={customer.id}
                  >
                    <td>

                      <div className="d-flex align-items-center gap-3">

                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                          style={{
                            width: 40,
                            height: 40,
                          }}
                        >
                          {(
                            customer.company_name ||
                            "C"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <div className="fw-bold">
                            {
                              customer.company_name
                            }
                          </div>

                          <small className="text-muted">
                            ID #
                            {
                              customer.id
                            }
                          </small>

                        </div>

                      </div>

                    </td>

                    <td>
                      {
                        customer.billing_email
                      }
                    </td>

                    <td>
                      {customer.contact_person ||
                        "-"}
                    </td>

                    <td>

                      <span className="badge bg-light text-dark border">

                        {
                          customer.country
                        }

                      </span>

                    </td>

                    <td>
                      {formatDate(
                        customer.created_at
                      )}
                    </td>

                    <td className="text-center">

                      <div className="d-flex justify-content-center gap-1">

                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            onView(
                              customer
                            )
                          }
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            onEdit(
                              customer
                            )
                          }
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() =>
                            onDelete(
                              customer
                            )
                          }
                        >
                          <i className="bi bi-trash"></i>
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )
            )}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      {totalPages > 1 && (

        <div className="card-footer bg-white d-flex justify-content-between align-items-center">

          <small>
            Page {currentPage} of{" "}
            {totalPages}
          </small>

          <div className="d-flex gap-2">

            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (p) => p - 1
                )
              }
            >
              <ChevronLeft size={16} />
            </button>

            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (p) => p + 1
                )
              }
            >
              <ChevronRight size={16} />
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default CustomerTable;