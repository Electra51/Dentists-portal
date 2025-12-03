import React from "react";

const StatCard = ({ number, label, icon: Icon }) => (
  <div className="flex items-center gap-2 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div className="w-12 h-12 bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 shadow-md rounded-lg flex items-center justify-center">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-900">{number}</h3>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  </div>
);

export default StatCard;
