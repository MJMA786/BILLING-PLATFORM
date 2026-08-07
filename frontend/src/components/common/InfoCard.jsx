function InfoCard({

  title,

  value,

}) {

  return (

    <div className="card border-0 shadow-sm rounded-4 h-100">

      <div className="card-body">

        <small className="text-muted">

          {title}

        </small>

        <h5 className="fw-bold mt-2">

          {value}

        </h5>

      </div>

    </div>

  );

}

export default InfoCard;