import { AlertTriangle, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";

export default function DeleteSubscriptionModal({
  show,
  subscription,
  onClose,
  onConfirm,
}) {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0,0,0,0.55)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="modal-content border-0 shadow-lg"
          style={{ borderRadius: "18px" }}
        >

          <div className="modal-header border-0">

            <h4 className="fw-bold mb-0">
              Delete Subscription
            </h4>

            <button
              className="btn btn-light rounded-circle"
              onClick={onClose}
            >
              <X size={18} />
            </button>

          </div>

          <div className="modal-body text-center">

            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#FEECEC",
              }}
            >
              <AlertTriangle
                size={42}
                color="#DC3545"
              />
            </div>

            <h5 className="fw-bold">
              Are you sure?
            </h5>

            <p className="text-muted">
              You are about to permanently delete the subscription for{" "}
              <strong>
                {subscription?.customer?.company_name || subscription?.customer?.contact_person || "this customer"}
              </strong>
              {subscription?.plan?.name && ` (${subscription.plan.name})`}
              .
            </p>

            <div
              className="alert alert-warning mt-4"
            >
              This action cannot be undone.
            </div>

          </div>

          <div className="modal-footer border-0">

            <button
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="btn btn-danger d-flex align-items-center gap-2"
              onClick={() => onConfirm(subscription)}
            >
              <Trash2 size={18} />
              Delete Subscription
            </button>

          </div>

        </motion.div>

      </div>
    </div>
  );
}