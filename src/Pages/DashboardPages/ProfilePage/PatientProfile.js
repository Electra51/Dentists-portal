import { Calendar, FileText, User, Clock, MapPin, Phone } from "lucide-react";
import React from "react";
import InfoItem from "./InfoItem";
import { calculateAge } from "../../../Utils/calculateAge";
import FormattedDate from "../../../Components/DateTimeFormate/FormattedDate";

const PatientProfile = ({ currentUser, latestAppointment, nextVisit }) => {
  return (
    <div className="space-y-6 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {latestAppointment && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-50">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Latest Appointment</p>
                <p className="text-lg font-bold text-gray-900">
                  <FormattedDate date={latestAppointment.appointmentDate} />
                </p>
              </div>
            </div>
          </div>
        )}

        {nextVisit && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-50">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Visit</p>
                <p className="text-lg font-bold text-gray-900">
                  <FormattedDate date={nextVisit.nextVisit} />
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#5ecdc9]" />
            Personal Information
          </h2>
          <div className="space-y-3">
            <InfoItem
              label="Date of Birth"
              value={
                currentUser.dateOfBirth
                  ? new Date(currentUser.dateOfBirth).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "long", year: "numeric" }
                    )
                  : "Not provided"
              }
            />
            <InfoItem
              label="Age"
              value={`${calculateAge(currentUser.dateOfBirth)} years`}
            />
            <InfoItem
              label="Blood Group"
              value={currentUser.bloodGroup || "Not provided"}
            />
            <InfoItem
              label="Emergency Contact"
              value={currentUser.emergencyContact || "Not provided"}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#5ecdc9]" />
            Medical History
          </h2>
          <div className="space-y-3">
            <InfoItem
              label="Allergies"
              value={currentUser.allergies || "None"}
            />
            <InfoItem
              label="Chronic Conditions"
              value={currentUser.chronicConditions || "None"}
            />
            <InfoItem
              label="Current Medications"
              value={currentUser.currentMedications || "None"}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {latestAppointment && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm p-6 border border-blue-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Latest Appointment Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {latestAppointment.doctorId?.profileImage ? (
                  <img
                    src={latestAppointment.doctorId.profileImage}
                    alt={latestAppointment.doctorId.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                    {latestAppointment.doctorId?.name?.charAt(0) || "D"}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-base">
                    {latestAppointment.doctorId?.name || "Doctor"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {latestAppointment.doctorId?.specialization || "Dentist"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-blue-200">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Date</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    <FormattedDate date={latestAppointment.appointmentDate} />
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Time</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {latestAppointment.appointmentTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {nextVisit && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm p-6 border border-green-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Next Visit Scheduled
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {nextVisit.doctorId?.profileImage ? (
                  <img
                    src={nextVisit.doctorId.profileImage}
                    alt={nextVisit.doctorId.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-lg">
                    {nextVisit.doctorId?.name?.charAt(0) || "D"}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-base">
                    {nextVisit.doctorId?.name || "Doctor"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {nextVisit.doctorId?.specialization || "Dentist"}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-green-200">
                <p className="text-xs text-gray-600 mb-1">Scheduled Date</p>
                <p className="text-xl font-bold text-green-600">
                  <FormattedDate date={nextVisit.nextVisit} />
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#5ecdc9]" />
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="text-base font-medium text-gray-900">
                {currentUser.phone || "Not provided"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-base font-medium text-gray-900">
                {currentUser.address || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
