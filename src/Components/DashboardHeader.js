import React from "react";

const DashboardHeader = ({ icon: Icon, title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
        <Icon className="w-8 h-8 text-[#5ecdc9]" />
        {title}
      </h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
};

export default DashboardHeader;
