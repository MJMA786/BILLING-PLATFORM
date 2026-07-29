function MySubscription() {
  return (
    <div className="container-fluid">

      <h1 className="mb-4">
        My Subscription
      </h1>

      <div className="card border-0 shadow-sm rounded-4">

        <div className="card-body">

          <h5 className="fw-bold">
            Active Plan
          </h5>

          <hr />

          <div className="row">

            <div className="col-md-4">
              <p className="text-muted mb-1">Plan</p>
              <h5>Pro Plan</h5>
            </div>

            <div className="col-md-4">
              <p className="text-muted mb-1">Status</p>
              <span className="badge bg-success">
                Active
              </span>
            </div>

            <div className="col-md-4">
              <p className="text-muted mb-1">Next Billing</p>
              <h5>15 Aug 2026</h5>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default MySubscription;