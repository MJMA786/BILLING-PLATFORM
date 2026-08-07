import {
  CheckCircle2,
  Clock3,
  AlertTriangle,
  XCircle,
  PauseCircle,
} from "lucide-react";

const statusConfig = {
  Active: {
    icon: CheckCircle2,
    bg: "success-subtle",
    text: "success",
    border: "success",
  },

  Trial: {
    icon: Clock3,
    bg: "warning-subtle",
    text: "warning",
    border: "warning",
  },

  Cancelled: {
    icon: XCircle,
    bg: "danger-subtle",
    text: "danger",
    border: "danger",
  },

  "Past Due": {
    icon: AlertTriangle,
    bg: "warning-subtle",
    text: "warning",
    border: "warning",
  },

  Paused: {
    icon: PauseCircle,
    bg: "secondary-subtle",
    text: "secondary",
    border: "secondary",
  },

  Expired: {
    icon: XCircle,
    bg: "dark",
    text: "light",
    border: "dark",
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    icon: Clock3,
    bg: "secondary-subtle",
    text: "secondary",
    border: "secondary",
  };

  const Icon = config.icon;

  return (
    <span
      className={`badge bg-${config.bg} text-${config.text} border border-${config.border} d-inline-flex align-items-center px-3 py-2`}
      style={{
        borderRadius: "999px",
        fontSize: "0.82rem",
        fontWeight: 600,
        gap: "6px",
      }}
    >
      <Icon size={15} />
      {status}
    </span>
  );
}