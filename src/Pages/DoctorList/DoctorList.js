/* eslint-disable no-unused-vars */
// pages/Admin/DoctorList.jsx
import React, { useState } from "react";
import {
  Stethoscope,
  Search,
  Loader2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  useGetAllDoctorsQuery,
  useApproveDoctorMutation,
  useRejectDoctorMutation,
} from "../../redux/api/adminApi";
import toast from "react-hot-toast";

export default function DoctorList() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, refetch } = useGetAllDoctorsQuery(statusFilter);

  const [approveDoctor, { isLoading: isApproving }] =
    useApproveDoctorMutation();
  const [rejectDoctor, { isLoading: isRejecting }] = useRejectDoctorMutation();

  const doctors = data?.data || [];

  // Client-side search filter
  const filteredDoctors = doctors.filter((doctor) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      doctor.name?.toLowerCase().includes(searchLower) ||
      doctor.email?.toLowerCase().includes(searchLower) ||
      doctor.specialization?.toLowerCase().includes(searchLower)
    );
  });

  const handleApprove = async (doctorId, doctorName) => {
    if (!window.confirm(`Approve Dr. ${doctorName}?`)) return;

    try {
      await approveDoctor(doctorId).unwrap();
      toast.success("Doctor approved successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to approve doctor");
    }
  };

  const handleReject = async (doctorId, doctorName) => {
    const reason = window.prompt(`Reason for rejecting Dr. ${doctorName}:`);
    if (!reason) return;

    try {
      await rejectDoctor({ doctorId, reason }).unwrap();
      toast.success("Doctor rejected");
      refetch();
    } catch (error) {
      toast.error("Failed to reject doctor");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Approved",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: <Clock className="w-4 h-4" />,
        label: "Pending",
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-700",
        icon: <XCircle className="w-4 h-4" />,
        label: "Rejected",
      },
    };

    const badge = badges[status] || badges.pending;

    return (
      <span
        className={`px-3 py-1 ${badge.bg} ${badge.text} rounded-full text-sm font-medium flex items-center gap-1 w-fit`}>
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-4">
          <Stethoscope className="w-8 h-8 text-cyan-500" />
          All Doctors
        </h1>

        {/* Filters */}
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

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredDoctors.length} of {doctors.length} doctors
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500">
                    No doctors found
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doctor) => (
                  <tr
                    key={doctor._id}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                          {/* {doctor.name?.charAt(0).toUpperCase()} */}
                          {doctor.profileImage ? (
                            <img
                              src={doctor.profileImage}
                              alt={doctor.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            doctor.name?.charAt(0) || "U"
                          )}
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            Dr. {doctor.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {doctor.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {doctor.specialization || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {doctor.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(doctor.verificationStatus)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(doctor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {doctor.verificationStatus === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleApprove(doctor._id, doctor.name)
                              }
                              disabled={isApproving}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Approve">
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleReject(doctor._id, doctor.name)
                              }
                              disabled={isRejecting}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Reject">
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {doctor.verificationStatus === "approved" && (
                          <span className="text-sm text-gray-400">
                            No actions
                          </span>
                        )}
                        {doctor.verificationStatus === "rejected" && (
                          <button
                            onClick={() =>
                              handleApprove(doctor._id, doctor.name)
                            }
                            disabled={isApproving}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Re-approve">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
