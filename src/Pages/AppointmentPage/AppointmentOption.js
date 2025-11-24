import React, { useState } from "react";
import { Clock, Users, ChevronRight } from "lucide-react";

const AppointmentOption = ({ option, setTreatments }) => {
  const { problemName, slots } = option;
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = (name) => {
    const iconMap = {
      "Teeth Orthodontics": "🦷",
      "Cosmetic Dentistry": "✨",
      "Teeth Cleaning": "🪥",
      "Cavity Protection": "🛡️",
      "Pediatric Dental": "👶",
      "Oral Surgery": "🏥",
    };
    return iconMap[name] || "🦷";
  };

  return (
    <div
      className="relative bg-white rounded-lg shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        border: "1px solid #e5e7eb",
      }}>
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      />

      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 shadow-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <span className="text-3xl">{getIcon(problemName)}</span>
      </div>

      <div className="p-6 pt-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-info transition-colors duration-300 text-center">
            {problemName}
          </h2>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl">
            <Clock className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium mb-1">
                Next Available
              </p>
              <p className="text-sm font-bold text-gray-800">
                {slots.length > 0 ? slots[0] : "Please Try Another day"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
            <Users className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium mb-1">
                Available Slots
              </p>
              <p className="text-sm font-bold text-gray-800">
                {slots.length} {slots.length > 1 ? "spaces" : "space"} available
              </p>
            </div>
          </div>
        </div>

        <div className="card-actions justify-center">
          <label
            disabled={slots.length === 0}
            htmlFor="booking-modal"
            onClick={() => setTreatments(option)}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              slots.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 hover:to-info rounded-md hover:shadow-xl shadow-[#5ecdc9]"
            }`}
            style={{
              transform:
                isHovered && slots.length > 0 ? "scale(1.02)" : "scale(1)",
            }}>
            {slots.length === 0 ? (
              "No Slots Available"
            ) : (
              <>
                Book Appointment
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default AppointmentOption;
