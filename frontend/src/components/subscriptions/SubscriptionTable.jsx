import { motion } from "framer-motion";
import {
  Mail,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Ban,
  PlayCircle,
  ArrowUpCircle,
} from "lucide-react";

import { formatCurrency, formatDate } from "../../utils/formatters";
import StatusBadge from "./StatusBadge";

function PlanBadge({ plan }) {
  if (!plan) return null;

  return (
    <div>
      <span className="badge bg-primary-subtle text-primary px-3 py-2 fw-semibold rounded-pill">
        {plan.name}
      </span>

      <div className="small text-muted mt-1">
        {formatCurrency(plan.price)} / {plan.billing_interval}
      </div>
    </div>
  );
}

export default function SubscriptionTable({
  subscriptions,
  onView,
  onDelete,
  onCancel,
  onResume,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card border-0 shadow-sm"
      style={{ borderRadius: "18px" }}
    >
      {/* Header */}

      <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
        <div>
          <h5 className="fw-bold mb-1 text-dark">
            Subscription Registry
          </h5>

          <small className="text-muted">
            Showing {subscriptions.length} subscriptions
          </small>
        </div>
      </div>

      {/* Table */}

      <div
        className="table-responsive"
        style={{
                overflow: "visible",
          }}
      >

        <table className="table align-middle mb-0">

          <thead className="table-light">

            <tr>

              <th style={{ minWidth: 280 }}>
                Customer
              </th>

              <th style={{ minWidth: 220 }}>
                Subscription
              </th>

              <th style={{ width: 120 }}>
                Status
              </th>

              <th style={{ width: 140 }}>
                Revenue
              </th>

              <th style={{ width: 170 }}>
                Renewal
              </th>

              <th style={{ width: 160 }}>
                Created
              </th>

              <th
                className="text-center"
                style={{ width: 90 }}
              >
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {subscriptions.length === 0 ? (

              <tr>

                <td
                  colSpan={7}
                  className="text-center py-5"
                >

                  <div className="text-muted">

                    <h6 className="fw-semibold">
                      No subscriptions found
                    </h6>

                    <small>
                      Assign a subscription to your first customer.
                    </small>

                  </div>

                </td>

              </tr>

            ) : (

              subscriptions.map((sub) => (

                <tr
                  key={sub.id}
                  className="align-middle"
                >

                  {/* Customer */}

                  <td>

                    <div className="d-flex align-items-center">

                      <div
                        className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: 46,
                          height: 46,
                          fontSize: 18,
                        }}
                      >
                        {sub.customer?.company_name?.charAt(0)?.toUpperCase() || sub.customer?.contact_person?.charAt(0)?.toUpperCase() || "C"}
                      </div>

                      <div>

                        <div className="fw-semibold text-dark">
                          {sub.customer?.company_name}
                        </div>

                        <small className="text-muted d-flex align-items-center gap-1">
                          <Mail size={13} />
                          {sub.customer?.billing_email}
                        </small>

                      </div>

                    </div>

                  </td>

                  {/* Subscription */}

                  <td>

                    <PlanBadge
                      plan={sub.plan}
                    />

                  </td>

                  {/* Status */}

                  <td>

                    <StatusBadge
                      status={sub.status}
                    />

                  </td>

                  {/* Revenue */}

                  <td>

                    <div className="fw-bold">
                      {formatCurrency(sub.plan?.price)}
                    </div>

                    <small className="text-muted">
                      / {sub.plan?.billing_interval}
                    </small>

                  </td>

                  {/* Renewal */}

                  <td>

                    <div className="fw-medium">
                      {formatDate(sub.current_period_end)}
                    </div>

                    <small className="text-success">
                      Auto Renew
                    </small>

                  </td>

                  {/* Created */}

                  <td>

                    <small className="text-muted">
                      {formatDate(sub.created_at)}
                    </small>

                  </td>

                  {/* Actions */}

                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">

                      {/* View */}

                      <button
                        className="btn btn-outline-primary btn-sm rounded-3"
                        title="View Subscription"
                        onClick={() => onView(sub)}
                      >
                        <Eye size={16} />
                      </button>

                      {/* Delete */}

                      <button
                        className="btn btn-outline-danger btn-sm rounded-3"
                        title="Delete Subscription"
                        onClick={() => onDelete(sub)}
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* Cancel / Resume */}

                      {sub.status === "cancelled" || sub.cancel_at_period_end ? (
                        <button
                          className="btn btn-outline-success btn-sm rounded-3"
                          title="Resume Subscription"
                          onClick={() => onResume(sub.id)}
                        >
                          <PlayCircle size={16} />
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-warning btn-sm rounded-3"
                          title="Cancel Subscription"
                          onClick={() => onCancel(sub.id)}
                        >
                          <Ban size={16} />
                        </button>
                      )}

                    </div>
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="card-footer bg-white border-0 py-3 px-4">

        <div className="d-flex justify-content-between align-items-center">

          <small className="text-muted">

            Showing

            <strong className="mx-1">
              {subscriptions.length}
            </strong>

            subscription{subscriptions.length !== 1 && "s"}

          </small>

          <small className="text-muted">

            Subscription Management

          </small>

        </div>

      </div>

    </motion.div>

  );

}
                      