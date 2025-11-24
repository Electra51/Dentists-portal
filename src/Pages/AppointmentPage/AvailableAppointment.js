import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Users, Sparkles } from "lucide-react";
import AppointmentOption from "./AppointmentOption";
import appointmentBg from "../../assets/images/appointment.png";
import BookingModal from "./BookingModal";
import PrimaryButton from "../../Components/PrimaryButton";

const AvailableAppointment = ({ selectedDate }) => {
  const [appointmentOptions, setAppointmentOptions] = useState([]);
  const [treatments, setTreatments] = useState(null);

  useEffect(() => {
    fetch("AppointmentOption.json")
      .then((res) => res.json())
      .then((data) => setAppointmentOptions(data));
  }, []);

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-full uppercase">
          <Calendar className="w-4 h-4" />
          <span className="">Available Appointments</span>
        </div>
        {/* <p className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 text-primary text-[12px] font-bold rounded-full uppercase">
          <Calendar className="w-[15px]" />{" "}
          <span className="pb-0 mt-0.5">Available Appointments</span>
        </p> */}
        <h2 className="text-4xl md:text-[43px] font-bold text-accent mb-1.5">
          Available Appointments on{" "}
          <span className=" text-green-600">
            ({format(selectedDate, "PP")})
          </span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4">
          Choose from our comprehensive range of dental services. Our expert
          team is ready to provide you with the best care.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 px-2">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">24+</p>
              <p className="text-sm text-gray-600">Available Slots Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">500+</p>
              <p className="text-sm text-gray-600">Happy Patients</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-yellow-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">15+</p>
              <p className="text-sm text-gray-600">Years Experience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid mt-8 gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto max-w-7xl px-2">
        {appointmentOptions.map((option, i) => (
          <AppointmentOption
            key={i}
            option={option}
            setTreatments={setTreatments}
          />
        ))}
      </div>

      <div
        className="mt-16 bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 shadow-md rounded-lg p-12 text-center mx-2"
        style={{ background: `url(${appointmentBg})` }}>
        <h2 className="text-4xl font-bold mb-4">Need Urgent Care?</h2>
        <p className="text-xl mb-8 opacity-90">
          Contact our emergency hotline for immediate assistance
        </p>

        <PrimaryButton
          variant="outline"
          className=" border border-white bg-white">
          Call Now: 1-800-DENTIST
        </PrimaryButton>
      </div>

      {treatments && (
        <BookingModal
          treatments={treatments}
          selectedDate={selectedDate}
          setTreatments={setTreatments}
        />
      )}
    </div>
  );
};

export default AvailableAppointment;
