import React from "react";
import clock from "../../assets/icons/clock.svg";
import marker from "../../assets/icons/marker.svg";
import phone from "../../assets/icons/phone.svg";
import InfoCard from "./InfoCard";

const InfoCards = () => {
  const cardData = [
    {
      id: 1,
      infoName: "Opening Hours",
      description: "Open 9.00am to 5.00pm everyday",
      icon: clock,
      bgClass: "bg-gradient-to-r from-secondary to-info",
    },
    {
      id: 2,
      infoName: "Visit our location",
      description: "Brooklyn, NY 10036, United States",
      icon: marker,
      bgClass: "bg-accent",
    },
    {
      id: 3,
      infoName: "Contact us now",
      description: "+000 123 456789",
      icon: phone,
      bgClass: "bg-gradient-to-r from-info to-secondary",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-20 lg:mt-32 p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardData.map((card) => (
        <InfoCard key={card.id} card={card} />
      ))}
    </div>
  );
};

export default InfoCards;
