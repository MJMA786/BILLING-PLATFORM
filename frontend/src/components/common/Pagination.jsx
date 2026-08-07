function Pagination({

  currentPage,

  totalPages,

  onPageChange,

}) {

  if (totalPages <= 1) return null;

  return (

    <nav className="mt-4">

      <ul className="pagination justify-content-center">

        <li
          className={`page-item ${
            currentPage === 1
              ? "disabled"
              : ""
          }`}
        >

          <button
            className="page-link"
            onClick={() =>
              onPageChange(currentPage - 1)
            }
          >

            Previous

          </button>

        </li>

        {Array.from({
          length: totalPages,
        }).map((_, index) => (

          <li
            key={index}
            className={`page-item ${
              currentPage === index + 1
                ? "active"
                : ""
            }`}
          >

            <button
              className="page-link"
              onClick={() =>
                onPageChange(index + 1)
              }
            >

              {index + 1}

            </button>

          </li>

        ))}

        <li
          className={`page-item ${
            currentPage === totalPages
              ? "disabled"
              : ""
          }`}
        >

          <button
            className="page-link"
            onClick={() =>
              onPageChange(currentPage + 1)
            }
          >

            Next

          </button>

        </li>

      </ul>

    </nav>

  );

}

export default Pagination;