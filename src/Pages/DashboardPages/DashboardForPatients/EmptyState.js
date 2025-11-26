import React from "react";

const EmptyState = ({ icon: Icon, title, message }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
      <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
        {Icon && <Icon className="w-10 h-10 text-gray-400" />}
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>

      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default EmptyState;
