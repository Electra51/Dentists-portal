import React from "react";
import { Star, Quote, MapPin } from "lucide-react";

const TestimonialCard = ({ review, isActive }) => {
  return (
    <div
      className={`bg-white rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 ${
        isActive ? "scale-105 border-primary/30" : ""
      }`}>
      <div className="w-14 h-14 md:w-16 md:h-16 -mt-10 bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 rounded-full flex items-center justify-center shadow-lg mx-auto md:mx-0">
        <Quote className="w-7 h-7 text-white" />
      </div>

      <div className="flex gap-1 mb-3 mt-6 justify-center md:justify-start">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
          />
        ))}
      </div>

      <p className="text-gray-600 leading-relaxed mb-6 text-center md:text-left">
        {review.review}
      </p>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6"></div>

      <div className="flex items-center gap-4">
        <img
          src={review.img}
          alt={review.name}
          className="w-16 h-16 rounded-full object-cover border-4 border-primary/20"
        />
        <div>
          <h4 className="font-bold text-gray-900 text-lg">{review.name}</h4>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{review.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
