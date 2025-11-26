import React, { useState } from "react";
import {
  Download,
  Calendar,
  Clock,
  Pill,
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  FilePlus,
} from "lucide-react";
import { useGetUserProfileQuery } from "../../../redux/api/authApi";
import { useGetPatientPrescriptionsQuery } from "../../../redux/api/prescriptionApi";
import DashboardHeader from "../../../Components/DashboardHeader";
import StatsCard from "../../../Components/StatsCard";
import PrimaryButton from "../../../Components/PrimaryButton";
import handlePrint from "../../../Utils/handlePrint";
import LoadingState from "../../../Components/states/LoadingState";
import MessageState from "../../../Components/states/MessageState";
import EmptyState from "../../../Components/states/EmptyState";
import FormattedDate from "../../../Components/DateTimeFormate/FormattedDate";

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
      <LoadingState
        message="Loading your prescriptions..."
        spinnerColor="border-[#5ecdc9]"
        height={"min-h-screen"}
      />
    );
  }

  if (!patientId) {
    return (
      <MessageState
        type="warning"
        title="Profile Not Found"
        message="Please login again to view your prescriptions."
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

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto p-5 md:p-7">
      <DashboardHeader
        icon={FilePlus}
        title="My Prescriptions"
        subtitle="Manage and track your medical prescriptions"
      />
      {/* stat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard
          title="Active Prescriptions"
          value={activePrescriptions}
          subtitle="Currently active"
          icon={FileText}
          gradientFrom="from-blue-400"
          gradientTo="to-blue-300"
        />

        <StatsCard
          title="Total Medicines"
          value={totalMedicines}
          subtitle="Prescribed medicines"
          icon={Pill}
          gradientFrom="from-cyan-400"
          gradientTo="to-cyan-600"
        />

        <StatsCard
          title="Upcoming Visits"
          value={upcomingVisits}
          subtitle="Scheduled visits"
          icon={Calendar}
          gradientFrom="from-green-500"
          gradientTo="to-green-400"
        />
      </div>
      {/* tab */}
      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm mb-6">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "all"
                ? "text-[#5ecdc9]"
                : "text-gray-600 hover:text-gray-800"
            }`}>
            All
            {activeTab === "all" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5ecdc9]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-6 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "active"
                ? "text-[#5ecdc9]"
                : "text-gray-600 hover:text-gray-800"
            }`}>
            Active
            {activeTab === "active" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5ecdc9]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "history"
                ? "text-[#5ecdc9]"
                : "text-gray-600 hover:text-gray-800"
            }`}>
            History
            {activeTab === "history" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5ecdc9]"></div>
            )}
          </button>
        </div>

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
      {/* prescription list */}
      {filteredPrescriptions?.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Prescriptions Found"
          message={
            searchTerm
              ? "Try adjusting your search terms"
              : "You don't have any prescriptions yet"
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredPrescriptions?.map((prescription) => {
            return (
              <div
                key={prescription._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          <span className="text-gray-600">PrescriptionID:</span>{" "}
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
                          <FormattedDate date={prescription.createdAt} />
                        </div>
                        {prescription.nextVisit && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">Next Date:</span>{" "}
                            <FormattedDate date={prescription.nextVisit} />
                          </div>
                        )}
                      </div>
                    </div>
                    <PrimaryButton onClick={() => handlePrint(prescription)}>
                      <Download className="w-4 h-4 mr-2" />
                      Print Prescription
                    </PrimaryButton>
                  </div>

                  <div className="bg-cyan-50 border border-[#63bbb850] rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="border border-cyan-500 rounded-full">
                        <img
                          src={prescription?.doctorId?.profileImage}
                          alt="dentist-pic"
                          className="w-9 h-9 rounded-full"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          Dr. {prescription.doctorName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {prescription.doctorSpecialization}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-[#5ecdc9]" />
                      <span className="font-medium">
                        {prescription.medicines?.length || 0} Medicine(s)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">BookingID: </span>
                      {prescription.appointmentId?.bookingId}
                    </div>
                  </div>

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

                  {selectedPrescription?._id === prescription._id && (
                    <div className="mt-6 pt-6 border-t space-y-4">
                      {prescription.medicines?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Pill className="w-5 h-5 text-[#5ecdc9]" />
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
                                  <span className="bg-[#5ecdc9] text-white px-3 py-1 rounded-full text-xs font-semibold">
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
                                    <span className="font-medium">
                                      Duration:
                                    </span>{" "}
                                    {medicine.duration}
                                  </div>
                                </div>
                                {medicine.instructions && (
                                  <div className="bg-white p-3 rounded text-sm text-gray-700 border-l-4 border-[#5ecdc9]">
                                    <strong>Instructions:</strong>{" "}
                                    {medicine.instructions}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyPrescriptionPage;
