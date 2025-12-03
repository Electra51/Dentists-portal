import React from "react";

const FeatureItem = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 group">
    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-r from-secondary to-info text-white hover:opacity-90  group-hover:scale-110 transition-all duration-300">
      <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
    </div>
    <span className="text-gray-700 font-medium">{text}</span>
  </div>
);

export default FeatureItem;
