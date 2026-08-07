function StatusBadge({

  status,

}) {

  const getClass = () => {

    switch (status?.toLowerCase()) {

      case "active":

      case "paid":

      case "completed":

      case "succeeded":

        return "success";

      case "pending":

      case "open":

        return "warning text-dark";

      case "failed":

      case "cancelled":

      case "void":

        return "danger";

      case "draft":

        return "secondary";

      case "invoiced":

        return "primary";

      default:

        return "dark";

    }

  };

  return (

    <span className={`badge bg-${getClass()}`}>

      {status}

    </span>

  );

}

export default StatusBadge;