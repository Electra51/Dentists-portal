import React, { useState } from "react";
import {
  Download,
  Calendar,
  Clock,
  Pill,
  FileText,
  User,
  Search,
  ChevronDown,
  ChevronUp,
  FilePlus,
} from "lucide-react";
import { useGetUserProfileQuery } from "../../../redux/api/authApi";
import { useGetPatientPrescriptionsQuery } from "../../../redux/api/prescriptionApi";
import DashboardHeader from "../../../Components/DashboardHeader";

const MyPrescriptionPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const { data: profileData, isLoading: profileLoading } =
    useGetUserProfileQuery();
  const patientId = profileData?.user?._id;

  const { data, isLoading, error } = useGetPatientPrescriptionsQuery(
    patientId,
    {
      skip: !patientId,
    }
  );

  if (profileLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading your prescriptions...
          </p>
        </div>
      </div>
    );
  }

  if (!patientId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-white rounded-xl shadow-sm p-8 border-l-4 border-yellow-400">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Profile Not Found
            </h2>
            <p className="text-gray-600">
              Please login again to view your prescriptions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-white rounded-xl shadow-sm p-8 border-l-4 border-red-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Unable to Load Prescriptions
              </h2>
            </div>
            <p className="text-gray-600">
              Please try refreshing the page or contact support if the problem
              persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const filteredPrescriptions = data?.data?.filter((prescription) => {
    const matchesSearch =
      prescription.doctorName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.diagnosis
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.medicines?.some((med) =>
        med.medicineName?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const today = new Date();
    const createdDate = new Date(prescription.createdAt);
    const daysDiff = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));

    if (activeTab === "active") {
      return prescription.status === "active" && matchesSearch;
    } else if (activeTab === "history") {
      return (
        (prescription.status === "completed" || daysDiff > 30) && matchesSearch
      );
    }
    return matchesSearch;
  });

  const activePrescriptions =
    data?.data?.filter((p) => p.status === "active").length || 0;
  const totalMedicines =
    data?.data?.reduce((acc, p) => acc + (p.medicines?.length || 0), 0) || 0;
  const upcomingVisits =
    data?.data?.filter((p) => p.nextVisit && new Date(p.nextVisit) > new Date())
      .length || 0;

  const handlePrint = (prescription) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Prescription - ${prescription.prescriptionId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #06b6d4; }
            .header { border-bottom: 2px solid #06b6d4; padding-bottom: 10px; margin-bottom: 20px; }
            .medicine { background: #f0f9ff; padding: 10px; margin: 10px 0; border-left: 4px solid #06b6d4; }
            .footer { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medical Prescription</h1>
            <p><strong>Prescription ID:</strong> ${
              prescription.prescriptionId
            }</p>
            <p><strong>Date:</strong> ${new Date(
              prescription.createdAt
            ).toLocaleDateString()}</p>
            <p><strong>Patient:</strong> ${prescription.patientName}</p>
          </div>
          <h2>Diagnosis</h2>
          <p>${prescription.diagnosis || "N/A"}</p>
          <h2>Prescribed Medicines</h2>
          ${
            prescription.medicines
              ?.map(
                (med, i) => `
            <div class="medicine">
              <h3>${i + 1}. ${med.medicineName}</h3>
              <p><strong>Dosage:</strong> ${med.dosage}</p>
              <p><strong>Frequency:</strong> ${med.frequency}</p>
              <p><strong>Duration:</strong> ${med.duration}</p>
              <p><strong>Instructions:</strong> ${
                med.instructions || "As directed"
              }</p>
            </div>
          `
              )
              .join("") || "<p>No medicines prescribed</p>"
          }
          ${
            prescription.generalInstructions
              ? `<h2>General Instructions</h2><p>${prescription.generalInstructions}</p>`
              : ""
          }
          <div class="footer">
            <p><strong>Doctor:</strong> ${prescription.doctorName}</p>
            <p><strong>Specialization:</strong> ${
              prescription.doctorSpecialization
            }</p>
            ${
              prescription.nextVisit
                ? `<p><strong>Next Visit:</strong> ${new Date(
                    prescription.nextVisit
                  ).toLocaleDateString()}</p>`
                : ""
            }
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto p-5 md:p-7">
      <DashboardHeader
        icon={FilePlus}
        title="My Prescriptions"
        subtitle="Manage and track your medical prescriptions"
      />

      {/* Stats Cards - Dashboard Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Active Prescriptions</p>
              <p className="text-4xl font-bold">{activePrescriptions}</p>
              <p className="text-blue-100 text-xs mt-1">Currently active</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <FileText className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm mb-1">Total Medicines</p>
              <p className="text-4xl font-bold">{totalMedicines}</p>
              <p className="text-cyan-100 text-xs mt-1">Prescribed medicines</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <Pill className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Upcoming Visits</p>
              <p className="text-4xl font-bold">{upcomingVisits}</p>
              <p className="text-green-100 text-xs mt-1">Scheduled visits</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <Calendar className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Search - Dashboard Style */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            {/* Tab Navigation - Dashboard Style */}
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === "all"
                    ? "text-cyan-500"
                    : "text-gray-600 hover:text-gray-800"
                }`}>
                All
                {activeTab === "all" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("active")}
                className={`px-6 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === "active"
                    ? "text-cyan-500"
                    : "text-gray-600 hover:text-gray-800"
                }`}>
                Active
                {activeTab === "active" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === "history"
                    ? "text-cyan-500"
                    : "text-gray-600 hover:text-gray-800"
                }`}>
                History
                {activeTab === "history" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"></div>
                )}
              </button>
            </div>

            {/* Search */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      {filteredPrescriptions?.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Prescriptions Found
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? "Try adjusting your search terms"
              : "You don't have any prescriptions yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPrescriptions?.map((prescription) => (
            <div
              key={prescription._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {prescription.prescriptionId}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          prescription.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                        {prescription.status === "active"
                          ? "Completed"
                          : prescription.status?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(prescription.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      {prescription.nextVisit && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Clock className="w-4 h-4" />
                          <span>
                            Next:{" "}
                            {new Date(
                              prescription.nextVisit
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handlePrint(prescription)}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Print
                  </button>
                </div>

                {/* Doctor Info */}
                <div className="bg-cyan-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-500 p-2 rounded-full">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {prescription.doctorName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {prescription.doctorSpecialization}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Diagnosis */}
                {prescription.diagnosis && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Diagnosis
                    </p>
                    <p className="text-gray-800">{prescription.diagnosis}</p>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-cyan-500" />
                    <span className="font-medium">
                      {prescription.medicines?.length || 0} Medicine(s)
                    </span>
                  </div>
                </div>

                {/* Toggle Details Button */}
                <button
                  onClick={() =>
                    setSelectedPrescription(
                      selectedPrescription?._id === prescription._id
                        ? null
                        : prescription
                    )
                  }
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm">
                  {selectedPrescription?._id === prescription._id ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      View Full Details
                    </>
                  )}
                </button>

                {/* Expanded Details */}
                {selectedPrescription?._id === prescription._id && (
                  <div className="mt-6 pt-6 border-t space-y-4">
                    {/* Medicines */}
                    {prescription.medicines?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Pill className="w-5 h-5 text-cyan-500" />
                          Prescribed Medicines
                        </h4>
                        <div className="space-y-3">
                          {prescription.medicines.map((medicine, index) => (
                            <div
                              key={medicine._id || index}
                              className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-semibold text-gray-800">
                                  {index + 1}. {medicine.medicineName}
                                </h5>
                                <span className="bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                  {medicine.dosage}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-2">
                                <div>
                                  <span className="font-medium">
                                    Frequency:
                                  </span>{" "}
                                  {medicine.frequency}
                                </div>
                                <div>
                                  <span className="font-medium">Duration:</span>{" "}
                                  {medicine.duration}
                                </div>
                              </div>
                              {medicine.instructions && (
                                <div className="bg-white p-3 rounded text-sm text-gray-700 border-l-4 border-cyan-500">
                                  <strong>Instructions:</strong>{" "}
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
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          General Instructions
                        </h4>
                        <p className="text-gray-700 text-sm">
                          {prescription.generalInstructions}
                        </p>
                      </div>
                    )}
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

export default MyPrescriptionPage;
