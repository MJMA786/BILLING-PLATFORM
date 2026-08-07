import { Modal, Button } from "react-bootstrap";

function BillingCycleViewModal({
  show,
  onClose,
  billingCycle,
}) {
  if (!billingCycle) return null;

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
    >

      <Modal.Header closeButton>

        <Modal.Title>

          Billing Cycle Details

        </Modal.Title>

      </Modal.Header>

      <Modal.Body>

        <div className="row g-4">

          <div className="col-md-6">

            <h6 className="text-muted">
              Billing Cycle ID
            </h6>

            <p>
              #{billingCycle.id}
            </p>

          </div>

          <div className="col-md-6">

            <h6 className="text-muted">
              Status
            </h6>

            <p>
              {billingCycle.status}
            </p>

          </div>

          <div className="col-md-6">

            <h6 className="text-muted">
              Customer
            </h6>

            <p>
              {
                billingCycle.subscription
                  ?.customer?.name
              }
            </p>

          </div>

          <div className="col-md-6">

            <h6 className="text-muted">
              Plan
            </h6>

            <p>
              {
                billingCycle.subscription
                  ?.plan?.name
              }
            </p>

          </div>

          <div className="col-md-6">

            <h6 className="text-muted">
              Cycle Start
            </h6>

            <p>
              {new Date(
                billingCycle.cycle_start
              ).toLocaleString()}
            </p>

          </div>

          <div className="col-md-6">

            <h6 className="text-muted">
              Cycle End
            </h6>

            <p>
              {new Date(
                billingCycle.cycle_end
              ).toLocaleString()}
            </p>

          </div>

          <div className="col-md-6">

            <h6 className="text-muted">
              Created At
            </h6>

            <p>
              {new Date(
                billingCycle.created_at
              ).toLocaleString()}
            </p>

          </div>

          <div className="col-md-6">

            <h6 className="text-muted">
              Subscription ID
            </h6>

            <p>
              #
              {
                billingCycle.subscription
                  ?.id
              }
            </p>

          </div>

        </div>

      </Modal.Body>

      <Modal.Footer>

        <Button
          variant="secondary"
          onClick={onClose}
        >

          Close

        </Button>

      </Modal.Footer>

    </Modal>
  );
}

export default BillingCycleViewModal;