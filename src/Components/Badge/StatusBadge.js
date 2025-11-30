import { AlertCircle, CheckCircle, Timer, XCircle } from "lucide-react";
import React from "react";

const STATUS_CONFIG = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    icon: AlertCircle,
    label: "Pending",
  },
  scheduled: {
    bg: "bg-blue-100 border-blue-200",
    text: "text-blue-700",
    icon: Timer,
    label: "Scheduled",
  },
  confirmed: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    icon: CheckCircle,
    label: "Confirmed",
  },
  completed: {
    bg: "bg-green-100",
    text: "text-green-700",
    icon: CheckCircle,
    label: "Completed",
  },
  cancelled: {
    bg: "bg-red-100",
    text: "text-red-700",
    icon: XCircle,
    label: "Cancelled",
  },
  "no-show": {
    bg: "bg-gray-100",
    text: "text-gray-700",
    icon: XCircle,
    label: "No Show",
  },
  approved: {
    bg: "bg-green-100",
    text: "text-green-700",
    icon: CheckCircle,
    label: "Approved",
  },
  rejected: {
    bg: "bg-red-100",
    text: "text-red-700",
    icon: XCircle,
    label: "Rejected",
  },
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <span
      className={`px-3 py-1 ${config.bg} ${config.text} rounded-full text-sm font-medium flex items-center gap-1 w-fit`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
