export default function PaymentStatusBadge({ status }) {
  const styles = {
    Paid: {
      bg: "#d1fae5",
      color: "#065f46",
    },
    Pending: {
      bg: "#fef3c7",
      color: "#92400e",
    },
    Failed: {
      bg: "#fee2e2",
      color: "#991b1b",
    },
    Refunded: {
      bg: "#dbeafe",
      color: "#1e40af",
    },
  };

  const style = styles[status] || {
    bg: "#e5e7eb",
    color: "#374151",
  };

  return (
    <span
      className="px-3 py-2 fw-semibold"
      style={{
        background: style.bg,
        color: style.color,
        borderRadius: "30px",
        fontSize: "13px",
        display: "inline-block",
        minWidth: "90px",
        textAlign: "center",
      }}
    >
      {status}
    </span>
  );
}