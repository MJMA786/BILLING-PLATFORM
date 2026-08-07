function DataTable({

  columns,

  data,

  emptyMessage = "No records found.",

}) {

  return (

    <div className="card border-0 shadow-sm rounded-4">

      <div className="table-responsive">

        <table className="table table-hover align-middle mb-0">

          <thead className="table-light">

            <tr>

              {columns.map((column) => (

                <th
                  key={column.key}
                  className={column.className || ""}
                >

                  {column.label}

                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {data.length === 0 ? (

              <tr>

                <td
                  colSpan={columns.length}
                  className="text-center py-5"
                >

                  {emptyMessage}

                </td>

              </tr>

            ) : (

              data.map((row, index) => (

                <tr key={row.id || index}>

                  {columns.map((column) => (

                    <td
                      key={column.key}
                    >

                      {column.render
                        ? column.render(row)
                        : row[column.key]}

                    </td>

                  ))}

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default DataTable;