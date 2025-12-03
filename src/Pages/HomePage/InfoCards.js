import React from "react";
import InfoCard from "./InfoCard";
import { cardData } from "../../Shared/Jsondata";

const InfoCards = () => {
  return (
    <div className="max-w-7xl mx-auto mt-20 lg:mt-32 p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardData.map((card) => (
        <InfoCard key={card.id} card={card} />
      ))}
    </div>
  );
};

export default InfoCards;
