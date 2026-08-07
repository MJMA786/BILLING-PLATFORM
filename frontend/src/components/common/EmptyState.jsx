function EmptyState({

  title = "No Data",

  message = "Nothing to display.",

}) {

  return (

    <div className="card border-0 shadow-sm rounded-4">

      <div className="card-body text-center py-5">

        <i className="bi bi-inbox fs-1 text-muted"></i>

        <h4 className="mt-3">

          {title}

        </h4>

        <p className="text-muted">

          {message}

        </p>

      </div>

    </div>

  );

}

export default EmptyState;