import React, { useState } from "react";
import { Stethoscope, Search, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import {
  useApproveDoctorMutation,
  useGetAllDoctorsQuery,
  useRejectDoctorMutation,
} from "../../../redux/api/authApi";
import DataTable from "../../../Components/DataTable/DataTable";
import DashboardHeader from "../../../Components/DashboardHeader";
import LoadingState from "../../../Components/states/LoadingState";
import StatusBadge from "../../../Components/Badge/StatusBadge";
import FormattedDate from "../../../Components/DateTimeFormate/FormattedDate";
import useApproveDoctor from "../../../hooks/useApproveDoctor";
import RejectionForm from "../../../Components/RejectionFrom";
import { Modal } from "../../../Components/Modal";

export default function AllDentistsList() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { data, isLoading, refetch } = useGetAllDoctorsQuery(statusFilter);

  const [approveDoctor, { isLoading: isApproving }] =
    useApproveDoctorMutation();
  const [rejectDoctor, { isLoading: isRejecting }] = useRejectDoctorMutation();

  const doctors = data?.data || [];

  const filteredDoctors = doctors.filter((doctor) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      doctor.name?.toLowerCase().includes(searchLower) ||
      doctor.email?.toLowerCase().includes(searchLower) ||
      doctor.specialization?.toLowerCase().includes(searchLower)
    );
  });
  const { handleApprove } = useApproveDoctor(approveDoctor, refetch);
  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      await rejectDoctor({
        doctorId: selectedDoctor._id,
        reason: rejectionReason,
      }).unwrap();

      toast.success("Doctor rejected successfully");
      setIsRejectModalOpen(false);
      setRejectionReason("");
      setSelectedDoctor(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject doctor");
    }
  };
  const openRejectModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsRejectModalOpen(true);
  };
  const columns = [
    {
      name: "Doctor",
      selector: (row) => row.name,
      width: "240px",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
            {row.profileImage ? (
              <img
                src={row.profileImage}
                alt={row.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              row.name?.charAt(0) || "U"
            )}
          </div>
          <div>
            <p className="font-medium text-[15px] text-gray-900">
              Dr. {row.name}
            </p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      name: "Specialization",
      width: "250px",
      selector: (row) => row.specialization,
      sortable: true,
      cell: (row) => (
        <span className="px-2.5 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[14px] font-medium">
          {row.specialization || "General"}
        </span>
      ),
    },
    {
      name: "Contact",
      selector: (row) => row.phone,
      cell: (row) => (
        <span className="text-sm text-gray-600">{row.phone || "N/A"}</span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.verificationStatus,
      sortable: true,
      cell: (row) => <StatusBadge status={row.verificationStatus} />,
    },
    {
      name: "Joined",
      selector: (row) => row.createdAt,
      sortable: true,
      cell: (row) => <FormattedDate date={row.createdAt} />,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.verificationStatus === "pending" && (
            <>
              <button
                onClick={() =>
                  handleApprove({
                    doctorId: row._id,
                    doctorName: row.name,
                  })
                }
                disabled={isApproving}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                title="Approve">
                <CheckCircle className="w-5 h-5" />
              </button>
              <button
                // onClick={() => handleReject(row._id, row.name)}
                onClick={() => openRejectModal(row)}
                disabled={isRejecting}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Reject">
                <XCircle className="w-5 h-5" />
              </button>
            </>
          )}
          {row.verificationStatus === "approved" && (
            <span className="text-sm text-gray-400">No actions</span>
          )}
          {row.verificationStatus === "rejected" && (
            <button
              onClick={() =>
                handleApprove({
                  doctorId: row._id,
                  doctorName: row.name,
                })
              }
              disabled={isApproving}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
              title="Re-approve">
              <CheckCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      ),
      right: true,
    },
  ];

  if (isLoading) {
    return (
      <LoadingState
        message="Loading dentists list..."
        spinnerColor="border-[#5ecdc9]"
        height={"min-h-screen"}
      />
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto p-6">
      <div className="flex justify-between items-start mb-2">
        <DashboardHeader
          icon={Stethoscope}
          title="Dentists Lists"
          subtitle={`Showing ${filteredDoctors.length} of ${doctors.length} dentists`}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredDoctors}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30, 50]}
      />

      {isRejectModalOpen && (
        <Modal
          isOpen={isRejectModalOpen}
          onClose={() => {
            setIsRejectModalOpen(false);
            setSelectedDoctor(null);
            setRejectionReason("");
          }}
          title="Reject Doctor Verification">
          <RejectionForm
            selectedDoctor={selectedDoctor}
            rejectionReason={rejectionReason}
            setRejectionReason={setRejectionReason}
            isRejecting={isRejecting}
            handleRejectSubmit={handleRejectSubmit}
            onCancel={() => {
              setIsRejectModalOpen(false);
              setSelectedDoctor(null);
              setRejectionReason("");
            }}
          />
        </Modal>
      )}
    </div>
  );
}
