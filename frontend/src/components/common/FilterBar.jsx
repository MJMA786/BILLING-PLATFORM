function FilterBar({

  children,

}) {

  return (

    <div className="card border-0 shadow-sm rounded-4 mb-4">

      <div className="card-body">

        <div className="row g-3">

          {children}

        </div>

      </div>

    </div>

  );

}

export default FilterBar;