import React from "react";

const ServiceCard = ({ service }) => {
  const { icon, serviceName, description } = service;
  return (
    <div className="card  group relative bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/30">
      <figure className="px-10 pt-10">
        <img src={icon} alt="Shoes" className="rounded-xl" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{serviceName}</h2>
        <p className="text-center">{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
