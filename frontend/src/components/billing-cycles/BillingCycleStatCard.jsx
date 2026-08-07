function BillingCycleStatCard({

  title,

  value,

  subtitle,

  icon,

  color,

}) {

  return (

    <div className="card border-0 shadow-sm rounded-4 h-100">

      <div className="card-body">

        <div className="d-flex justify-content-between">

          <div>

            <h6 className="text-muted">

              {title}

            </h6>

            <h2 className="fw-bold">

              {value}

            </h2>

            <small className="text-muted">

              {subtitle}

            </small>

          </div>

          <div>

            <i
              className={`${icon} fs-1 text-${color}`}
            ></i>

          </div>

        </div>

      </div>

    </div>

  );

}

export default BillingCycleStatCard;