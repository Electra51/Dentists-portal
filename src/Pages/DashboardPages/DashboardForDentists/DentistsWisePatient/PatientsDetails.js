import React, { useState } from "react";
import {
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity,
  AlertCircle,
  Pill,
  FileText,
  Clock,
  User,
  Heart,
  Droplet,
  CreditCard,
  CheckCircle,
  XCircle,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingState from "../../../../Components/states/LoadingState";
import MessageState from "../../../../Components/states/MessageState";
import { calculateAge } from "../../../../Utils/calculateAge";
import FormattedDate from "../../../../Components/DateTimeFormate/FormattedDate";
import getStatusBadge from "../../../../Components/Badge/getStatusBadge";
import { useGetPatientDetailsByDoctorQuery } from "../../../../redux/api/authApi";

const PatientsDetails = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { data, isLoading, isError } =
    useGetPatientDetailsByDoctorQuery(patientId);

  if (isLoading) {
    return (
      <LoadingState
        message="Loading patients details..."
        spinnerColor="border-[#5ecdc9]"
        height={"min-h-screen"}
      />
    );
  }

  if (isError || !data?.success) {
    return (
      <MessageState
        type="error"
        title="Error loading patient details"
        message="Please try refreshing the page or contact support if the problem persists."
      />
    );
  }

  const patient = data.data.patient;
  const appointments = data.data.appointments || [];
  const prescriptions = data.data.prescriptions || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard/my-patients")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Patients List</span>
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              onClick={() => navigate("/patients-list")}
              className="hover:text-cyan-600 transition-colors">
              Patients List
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Patient Details</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <img
                src={patient.profileImage}
                alt={patient.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-cyan-100"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {patient.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {calculateAge(patient.dateOfBirth)} years
                  </span>
                  <span className="flex items-center gap-1">
                    <Droplet className="w-4 h-4" />
                    {patient.bloodGroup}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <FormattedDate date={patient.dateOfBirth} />
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium">
                + New Prescription
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-cyan-500" />
              Contact Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{patient.email}</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="text-gray-600">{patient.address}</span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Emergency Contact</p>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-gray-900 font-medium">
                    {patient.emergencyContact}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-500" />
              Medical Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Chronic Conditions</p>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-900 font-medium">
                    {patient.chronicConditions}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Current Medications
                </p>
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-900">
                    {patient.currentMedications}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Allergies</p>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-900">
                    {patient.allergies}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-500" />
              Quick Stats
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Total Appointments
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  {appointments.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Prescriptions</span>
                <span className="text-2xl font-bold text-gray-900">
                  {prescriptions.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Visit</span>
                <span className="text-sm font-medium text-gray-900">
                  {appointments.length > 0 ? (
                    <FormattedDate date={appointments[0].appointmentDate} />
                  ) : (
                    "N/A"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}>
                Overview
              </button>
              <button
                onClick={() => setActiveTab("appointments")}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "appointments"
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}>
                Appointments ({appointments.length})
              </button>
              <button
                onClick={() => setActiveTab("prescriptions")}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "prescriptions"
                    ? "border-cyan-500 text-cyan-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}>
                Prescriptions ({prescriptions.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  {appointments.length === 0 && prescriptions.length === 0 ? (
                    <p className="text-gray-500 text-sm">No recent activity</p>
                  ) : (
                    <div className="space-y-3">
                      {appointments.slice(0, 3).map((apt) => (
                        <div
                          key={apt._id}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-cyan-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {apt.service}
                            </p>
                            <p className="text-xs text-gray-500">
                              <FormattedDate date={apt.appointmentDate} /> at{" "}
                              {apt.appointmentTime}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                              apt.status
                            )}`}>
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "appointments" && (
              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">
                    No appointments found
                  </p>
                ) : (
                  appointments.map((apt) => (
                    <div
                      key={apt._id}
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {apt.service}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Booking ID: {apt.bookingId}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            apt.status
                          )}`}>
                          {apt.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            <FormattedDate date={apt.appointmentDate} />
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {apt.appointmentTime} ({apt.duration} min)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {apt.doctorName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Activity className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {apt.doctorSpecialization}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Payment:{" "}
                            <span className="font-medium text-gray-900">
                              ৳{apt.payment.paidAmount}
                            </span>
                          </span>
                          {apt.payment.paymentStatus === "paid" ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500 capitalize">
                          {apt.payment.paymentMethod}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "prescriptions" && (
              <div className="space-y-4">
                {prescriptions.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">
                    No prescriptions found
                  </p>
                ) : (
                  prescriptions.map((prx) => (
                    <div
                      key={prx._id}
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Prescription #{prx.prescriptionId}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Dr. {prx.doctorName} - {prx.doctorSpecialization}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          <FormattedDate date={prx.createdAt} />
                        </span>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          Diagnosis
                        </p>
                        <p className="text-sm text-blue-700">{prx.diagnosis}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                          Medicines
                        </p>
                        <div className="space-y-2">
                          {prx.medicines.map((med, index) => (
                            <div
                              key={med._id}
                              className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {med.medicineName}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {med.duration}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                {med.dosage} • {med.frequency}
                              </p>
                              <p className="text-xs text-gray-500 italic">
                                {med.instructions}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {prx.generalInstructions && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                          <p className="text-sm font-medium text-yellow-900 mb-1">
                            General Instructions
                          </p>
                          <p className="text-sm text-yellow-700 whitespace-pre-line">
                            {prx.generalInstructions}
                          </p>
                        </div>
                      )}

                      {prx.nextVisit && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            Next visit:{" "}
                            <span className="font-medium text-gray-900">
                              <FormattedDate date={prx.nextVisit} />
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsDetails;
