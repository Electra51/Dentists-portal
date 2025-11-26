import React, { useState } from "react";
import { useGetDoctorPrescriptionsQuery } from "../../../redux/api/prescriptionApi";
import { FilePlus } from "lucide-react";
import DashboardHeader from "../../../Components/DashboardHeader";
import MessageState from "../../../Components/states/MessageState";
import LoadingState from "../../../Components/states/LoadingState";

const DentistsPrescriptionList = () => {
  const { data, isLoading, error } = useGetDoctorPrescriptionsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Filter prescriptions
  const filteredPrescriptions = data?.data?.filter((prescription) => {
    const matchesSearch =
      prescription.patientName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.prescriptionId
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.appointmentId?.bookingId
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesDate = filterDate
      ? new Date(prescription.createdAt).toLocaleDateString() ===
        new Date(filterDate).toLocaleDateString()
      : true;

    const matchesStatus = filterStatus
      ? prescription.status === filterStatus
      : true;

    return matchesSearch && matchesDate && matchesStatus;
  });

  if (isLoading) {
    return (
      <LoadingState
        message="Loading all prescription lists..."
        spinnerColor="border-[#5ecdc9]"
        height={"min-h-screen"}
      />
    );
  }

  if (error) {
    return (
      <MessageState
        type="error"
        title="Unable to Load Prescriptions"
        message="Please try refreshing the page or contact support if the problem persists."
      />
    );
  }

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto p-5 md:p-7">
      <DashboardHeader
        icon={FilePlus}
        title="Prescriptions List"
        subtitle={`Total: ${data?.count || 0} prescriptions`}
      />

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Patient name, Prescription ID or Booking ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      {filteredPrescriptions?.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No prescriptions found
          </h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPrescriptions?.map((prescription) => (
            <div
              key={prescription._id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <div className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium">
                        {prescription.prescriptionId}
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {prescription.appointmentId?.bookingId || "N/A"}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          prescription.status === "active"
                            ? "bg-green-100 text-green-800"
                            : prescription.status === "completed"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                        {prescription.status?.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(prescription.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {prescription.patientName}
                    </h3>

                    <div className="flex gap-4 text-sm text-gray-600 flex-wrap">
                      <span>📧 {prescription.patientId?.email || "N/A"}</span>
                      <span>📞 {prescription.patientId?.phone || "N/A"}</span>
                      {prescription.patientId?.bloodGroup && (
                        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded">
                          🩸 {prescription.patientId.bloodGroup}
                        </span>
                      )}
                    </div>

                    {prescription.appointmentId && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span>
                          📅{" "}
                          {new Date(
                            prescription.appointmentId.appointmentDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="ml-3">
                          🕐 {prescription.appointmentId.appointmentTime}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setSelectedPrescription(
                        selectedPrescription?._id === prescription._id
                          ? null
                          : prescription
                      )
                    }
                    className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex-shrink-0">
                    {selectedPrescription?._id === prescription._id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </div>

                {/* Quick Summary */}
                <div className="flex gap-4 text-sm border-t pt-3">
                  <span className="text-gray-600">
                    💊 {prescription.medicines?.length || 0} Medicine(s)
                  </span>
                  {prescription.nextVisit && (
                    <span className="text-gray-600">
                      📆 Next Visit:{" "}
                      {new Date(prescription.nextVisit).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  )}
                </div>

                {/* Expanded Details */}
                {selectedPrescription?._id === prescription._id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-6">
                      {/* Diagnosis */}
                      {prescription.diagnosis && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <span className="text-lg">🔍</span> Diagnosis
                          </h4>
                          <p className="text-gray-600 bg-yellow-50 p-3 rounded-lg">
                            {prescription.diagnosis}
                          </p>
                        </div>
                      )}

                      {/* Medicines */}
                      {prescription.medicines?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <span className="text-lg">💊</span> Prescribed
                            Medicines
                          </h4>
                          <div className="space-y-3">
                            {prescription.medicines.map((medicine, index) => (
                              <div
                                key={medicine._id || index}
                                className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border border-cyan-100">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-semibold text-gray-800 text-lg">
                                    {index + 1}. {medicine.medicineName}
                                  </h5>
                                  <span className="bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                    {medicine.dosage}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-2">
                                  <div>
                                    <span className="font-medium">
                                      Frequency:
                                    </span>{" "}
                                    {medicine.frequency}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Duration:
                                    </span>{" "}
                                    {medicine.duration}
                                  </div>
                                </div>
                                {medicine.instructions && (
                                  <div className="bg-white p-2 rounded text-sm text-gray-600 border-l-4 border-cyan-500">
                                    <span className="font-medium">
                                      Instructions:
                                    </span>{" "}
                                    {medicine.instructions}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* General Instructions */}
                      {prescription.generalInstructions && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <span className="text-lg">📋</span> General
                            Instructions
                          </h4>
                          <p className="text-gray-600 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                            {prescription.generalInstructions}
                          </p>
                        </div>
                      )}

                      {/* Next Visit */}
                      {prescription.nextVisit && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <span className="text-lg">📅</span> Next Visit
                            Scheduled
                          </h4>
                          <p className="text-gray-700 text-lg font-medium">
                            {new Date(
                              prescription.nextVisit
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      )}

                      {/* Doctor Info */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Prescribed By
                        </h4>
                        <p className="text-gray-700 font-medium">
                          {prescription.doctorName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {prescription.doctorSpecialization}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DentistsPrescriptionList;
