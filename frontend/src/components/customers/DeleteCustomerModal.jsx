function DeleteCustomerModal({
  show,
  customer,
  onClose,
  onConfirm,
}) {
  if (!show || !customer) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block" }}
      >
        <div className="modal-dialog modal-dialog-centered">

          <div className="modal-content">

            <div className="modal-header bg-danger text-white">

              <h5 className="modal-title">
                Delete Customer
              </h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>

            </div>

            <div className="modal-body">

              <p>
                Are you sure you want to delete this customer?
              </p>

              <div className="border rounded p-3 bg-light">

                <h6 className="mb-1">
                  {customer.name}
                </h6>

                <small className="text-muted">
                  {customer.email}
                </small>

              </div>

              <div className="alert alert-warning mt-3 mb-0">
                This action cannot be undone.
              </div>

            </div>

            <div className="modal-footer">

              <button
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                className="btn btn-danger"
                onClick={onConfirm}
              >
                Delete Customer
              </button>

            </div>

          </div>

        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default DeleteCustomerModal;