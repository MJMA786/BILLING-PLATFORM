function CustomerStatCard({

    title,

    value,

    subtitle,

    icon,

    color = "primary",

}) {

    return (

        <div className="customer-stat-card">

            <div className="customer-stat-left">

                <small>

                    {title}

                </small>

                <h3>

                    {value}

                </h3>

                {subtitle && (

                    <span>

                        {subtitle}

                    </span>

                )}

            </div>

            <div className={`customer-stat-icon ${color}`}>

                <i className={`bi ${icon}`}></i>

            </div>

        </div>

    );

}

export default CustomerStatCard;