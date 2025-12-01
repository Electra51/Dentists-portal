import React, { useState } from "react";
import {
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Award,
  FileText,
  Briefcase,
  Loader2,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useApproveDoctorMutation,
  useGetPendingDoctorsQuery,
  useRejectDoctorMutation,
} from "../../../redux/api/authApi";
import LoadingState from "../../../Components/states/LoadingState";
import DashboardHeader from "../../../Components/DashboardHeader";
import EmptyState from "../../../Components/states/EmptyState";
import useApproveDoctor from "../../../hooks/useApproveDoctor";
import RejectionFrom from "../../../Components/RejectionFrom";
import { Modal } from "../../../Components/Modal";

export default function DentistsVerification() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const { data, isLoading, refetch } = useGetPendingDoctorsQuery();
  const [approveDoctor, { isLoading: isApproving }] =
    useApproveDoctorMutation();
  const [rejectDoctor, { isLoading: isRejecting }] = useRejectDoctorMutation();

  const pendingDoctors = data?.data || [];

  const filteredDoctors = pendingDoctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.bmdcNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const { handleApprove } = useApproveDoctor(approveDoctor, refetch);

  const handleRejectClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      const res = await rejectDoctor({
        doctorId: selectedDoctor._id,
        reason: rejectionReason,
      }).unwrap();

      toast.success(res.message || "Doctor verification rejected");
      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedDoctor(null);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to reject doctor");
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        message="Loading..."
        spinnerColor="border-[#5ecdc9]"
        height={"min-h-screen"}
      />
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <DashboardHeader
            icon={UserCheck}
            title="Dentists Verification Requests"
            subtitle="Review and approve doctor registration requests"
          />

          <div className="flex justify-center items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or BMDC number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div className="bg-cyan-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-600">
                Pending Requests{" "}
                <span className="text-2xl font-bold text-cyan-600">
                  {pendingDoctors.length}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Prescriptions Found"
          message={
            searchQuery
              ? "No dentists found matching your search"
              : "All verification requests have been processed"
          }
        />
      ) : (
        <div className="space-y-6 max-w-[1440px] mx-auto">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-yellow-500">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden flex-shrink-0">
                  {doctor.profileImage ? (
                    <img
                      src={doctor.profileImage}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    doctor.name?.charAt(0) || "D"
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {doctor.name}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                        <Clock className="w-4 h-4" />
                        Pending Verification
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handleApprove({
                            doctorId: doctor._id,
                          })
                        }
                        disabled={isApproving}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {isApproving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleRejectClick(doctor)}
                        disabled={isRejecting}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <XCircle className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 text-cyan-500" />
                      <span className="text-sm">{doctor.email}</span>
                    </div>
                    {doctor.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-cyan-500" />
                        <span className="text-sm">{doctor.phone}</span>
                      </div>
                    )}
                    {doctor.address && (
                      <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                        <MapPin className="w-4 h-4 text-cyan-500" />
                        <span className="text-sm">{doctor.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-cyan-500" />
                      Professional Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InfoRow
                        label="Specialization"
                        value={doctor.specialization || "N/A"}
                        icon={<Briefcase className="w-4 h-4" />}
                      />
                      <InfoRow
                        label="BMDC Number"
                        value={doctor.bmdcNumber || "N/A"}
                        icon={<FileText className="w-4 h-4" />}
                      />
                      <InfoRow
                        label="Experience"
                        value={doctor.experience || "N/A"}
                        icon={<Clock className="w-4 h-4" />}
                      />
                      <InfoRow
                        label="Qualification"
                        value={doctor.qualification || "N/A"}
                        icon={<Award className="w-4 h-4" />}
                      />
                    </div>
                  </div>

                  {doctor.verificationRequestDate && (
                    <div className="mt-3 text-xs text-gray-500">
                      Requested on:{" "}
                      {new Date(doctor.verificationRequestDate).toLocaleString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showRejectModal && (
        <Modal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setSelectedDoctor(null);
            setRejectionReason("");
          }}
          title="Reject Doctor Verification">
          <RejectionFrom
            selectedDoctor={selectedDoctor}
            rejectionReason={rejectionReason}
            setRejectionReason={setRejectionReason}
            isRejecting={isRejecting}
            handleRejectSubmit={handleRejectSubmit}
            onCancel={() => {
              setShowRejectModal(false);
              setSelectedDoctor(null);
              setRejectionReason("");
            }}
          />
        </Modal>
      )}
    </div>
  );
}

const InfoRow = ({ label, value, icon }) => (
  <div className="flex items-start gap-2">
    <span className="text-cyan-500 mt-0.5">{icon}</span>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  </div>
);
