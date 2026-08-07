import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

function ActionButtons({

  onView,

  onEdit,

  onDelete,

}) {

  return (

    <div className="d-flex justify-content-center gap-2">

      {onView && (

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={onView}
        >

          <Eye size={16} />

        </button>

      )}

      {onEdit && (

        <button
          className="btn btn-outline-warning btn-sm"
          onClick={onEdit}
        >

          <Pencil size={16} />

        </button>

      )}

      {onDelete && (

        <button
          className="btn btn-outline-danger btn-sm"
          onClick={onDelete}
        >

          <Trash2 size={16} />

        </button>

      )}

    </div>

  );

}

export default ActionButtons;