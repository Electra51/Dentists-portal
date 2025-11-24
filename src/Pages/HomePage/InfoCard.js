// import React from "react";

// const InfoCard = ({ card }) => {
//   const { description, infoName, bgClass, icon } = card;
//   return (
//     <div className={`card text-white p-6 md:card-side shadow-xl ${bgClass}`}>
//       <div className="flex-shrink-0 flex flex-column justify-center items-center">
//         <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
//           <img src={icon} alt={infoName} className="w-12 h-12" />
//         </div>
//       </div>
//       <div className="card-body ">
//         <h2 className="card-title">{infoName}</h2>
//         <p>{description}</p>
//       </div>
//     </div>
//   );
// };

// export default InfoCard;

import React from "react";

const InfoCard = ({ card }) => {
  const { description, infoName, bgClass, icon } = card;

  return (
    <div
      className={`
        card text-white shadow-xl px-6 ${bgClass}
        flex flex-col 
        md:flex-row 
        items-center gap-6 py-12
      `}>
      <div className="flex-shrink-0 flex items-center justify-center">
        <div
          className="
            w-20 h-20 bg-white/20 backdrop-blur-sm 
            rounded-xl flex items-center justify-center 
            transition-all duration-300
          ">
          <img src={icon} alt={infoName} className="w-12 h-12" />
        </div>
      </div>

      <div className="card-body p-0">
        <h2 className="card-title">{infoName}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default InfoCard;
