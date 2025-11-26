import React from "react";

const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradientFrom = "from-blue-500",
  gradientTo = "to-blue-600",
  iconBg = "bg-white/20",
  textColor = "text-white",
}) => {
  return (
    <div
      className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl shadow-lg p-6 ${textColor}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>

        <span className="text-4xl font-bold">{value}</span>
      </div>

      <h3 className="text-xl text-white font-medium mb-1">{title}</h3>
      <p className="text-sm text-gray-100 tracking-wider">{subtitle}</p>
    </div>
  );
};

export default StatsCard;
