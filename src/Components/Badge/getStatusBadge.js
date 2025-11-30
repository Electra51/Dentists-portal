import { AlertCircle, CheckCircle, Timer, XCircle } from "lucide-react";
import React from "react";

const getStatusBadge = (status) => {
  const badges = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: <AlertCircle className="w-4 h-4" />,
      label: "Pending",
    },
    scheduled: {
      bg: "bg-blue-100 border-blue-200",
      text: "text-blue-700",
      icon: <Timer className="w-4 h-4" />,
      label: "Scheduled",
    },
    confirmed: {
      bg: "bg-cyan-100",
      text: "text-cyan-700",
      icon: <CheckCircle className="w-4 h-4" />,
      label: "Confirmed",
    },
    completed: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: <CheckCircle className="w-4 h-4" />,
      label: "Completed",
    },
    cancelled: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: <XCircle className="w-4 h-4" />,
      label: "Cancelled",
    },
    "no-show": {
      bg: "bg-gray-100",
      text: "text-gray-700",
      icon: <XCircle className="w-4 h-4" />,
      label: "No Show",
    },
  };

  const badge = badges[status] || badges.pending;

  return (
    <span
      className={`px-3 py-1 ${badge.bg} ${badge.text} rounded-full text-sm font-medium flex items-center gap-1 w-fit`}>
      {badge.icon}
      {badge.label}
    </span>
  );
};

export default getStatusBadge;
