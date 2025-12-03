import { Calendar } from "lucide-react";
import React from "react";

const Schedule = ({ daysOfWeek, dentist }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Weekly Schedule</h2>
      <div className="space-y-3">
        {daysOfWeek.map((day) => {
          const daySchedule = dentist.schedule?.schedule?.[day];

          return (
            <div
              key={day}
              className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                daySchedule?.isAvailable
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}>
              <div className="flex items-center gap-3">
                <Calendar
                  className={`w-5 h-5 ${
                    daySchedule?.isAvailable
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />
                <span className="font-semibold text-gray-900 capitalize">
                  {day}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {daySchedule?.isAvailable ? (
                  daySchedule.slots.map((slot, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white border border-green-300 rounded-lg text-sm font-medium text-green-700">
                      {slot.start} - {slot.end}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">Unavailable</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;
