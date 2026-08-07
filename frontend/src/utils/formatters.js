/**
 * Subly Utility Formatters
 */

/**
 * Format currency amount with symbol (defaults to INR ₹)
 */
export const formatCurrency = (amount, currency = "INR") => {
  const numericAmount = Number(amount) || 0;
  if (currency === "INR") {
    return `₹${numericAmount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(numericAmount);
};

/**
 * Format date string or object to readable format
 */
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
  };

  return date.toLocaleDateString("en-US", options);
};

/**
 * Get Bootstrap badge variant class based on status string
 */
export const getStatusBadgeClass = (status) => {
  if (!status) return "bg-secondary";
  const normalized = status.toString().toLowerCase();

  switch (normalized) {
    case "active":
    case "paid":
    case "success":
    case "completed":
      return "bg-success";

    case "pending":
    case "trialing":
    case "open":
    case "due":
      return "bg-warning text-dark";

    case "canceled":
    case "cancelled":
    case "expired":
    case "failed":
    case "void":
      return "bg-danger";

    case "draft":
    case "paused":
      return "bg-secondary";

    default:
      return "bg-primary";
  }
};
