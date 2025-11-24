import React from "react";
import appointmentBg from "../assets/images/appointment.png";

const PageHeader = ({ title, description }) => {
  return (
    <div
      className="bg-gradient-to-r from-teal-600 to-teal-500 text-white py-24 px-4 mt-20"
      style={{ background: `url(${appointmentBg})` }}>
      <div className="max-w-7xl mx-auto px-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-lg text-teal-100 max-w-3xl">{description}</p>
      </div>
    </div>
  );
};

export default PageHeader;
