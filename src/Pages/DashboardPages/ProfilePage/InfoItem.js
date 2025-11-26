import React from "react";

function InfoItem({ label, value }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600 font-medium">{label}</span>
      <span className="text-sm text-gray-900 text-right max-w-xs">{value}</span>
    </div>
  );
}

export default InfoItem;
