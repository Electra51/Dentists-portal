import React from "react";
import banner from "../../assets/images/chair.png";
import { DayPicker } from "react-day-picker";
import appointmentBg from "../../assets/images/appointment.png";
import "./CustomDayPicker.css";

const AppointmentHeader = ({ selectedDate, setSelectedDate }) => {
  return (
    <div>
      <div
        className="bg-gradient-to-r from-teal-600 to-teal-500 text-white py-24 px-4 mt-20"
        style={{ background: `url(${appointmentBg})` }}>
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book Your Appointment
          </h1>
          <p className="text-lg text-teal-100">
            Choose a convenient date and time for your dental care
          </p>
        </div>
      </div>
      <div
        className="hero min-h-max max-w-7xl mx-auto rounded-md p-10 my-16"
        style={{
          backgroundImage: `url("https://i.ibb.co/wNqKDzB/bg.png")`,
        }}>
        <div className="hero-content grid grid-cols-2">
          <div className="daypicker-wrapper">
            <DayPicker
              animate
              mode="single"
              fixedWeeks
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
              showOutsideDays
              captionLayout="dropdown-buttons"
              fromYear={2020}
              toYear={2030}
              className="custom-daypicker"
            />
          </div>

          <div className="relative bg-white rounded-3xl shadow-2xl p-3 sm:p-4 transform hover:scale-105 transition-transform duration-500 m-6 sm:m-11">
            <img
              src={banner}
              alt="dentist-chair"
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentHeader;
