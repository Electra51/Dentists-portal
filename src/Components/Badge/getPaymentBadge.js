import { AlertTriangle, DollarSign } from "lucide-react";
import React from "react";

const getPaymentBadge = (paymentStatus, paymentMethod) => {
  if (paymentStatus === "paid") {
    return (
      <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
        <DollarSign className="w-3 h-3" />
        Paid ({paymentMethod})
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1">
      <AlertTriangle className="w-3 h-3" />
      Pending
    </span>
  );
};

export default getPaymentBadge;
