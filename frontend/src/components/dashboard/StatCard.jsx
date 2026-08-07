function StatCard({

  title,

  value,

  icon,

  color,

  subtitle,

  change,

}) {

  return (

    <div className="stat-card">

      <div className="stat-top">

        <div className={`stat-icon ${color}`}>

          <i className={`bi ${icon}`}></i>

        </div>

        {change && (

          <span className="stat-change">

            <i className="bi bi-arrow-up-right"></i>

            {change}

          </span>

        )}

      </div>

      <div className="stat-content">

        <h6>

          {title}

        </h6>

        <h2>{value}</h2>

        <small>

          {subtitle}

        </small>

      </div>

    </div>

  );

}

export default StatCard;