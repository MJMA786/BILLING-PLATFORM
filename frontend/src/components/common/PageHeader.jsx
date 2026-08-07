function PageHeader({

  tag,

  title,

  description,

}) {

  return (

    <div className="customers-header mb-4">

      <div>

        <span className="dashboard-tag">

          {tag}

        </span>

        <h1>

          {title}

        </h1>

        <p>

          {description}

        </p>

      </div>

    </div>

  );

}

export default PageHeader;