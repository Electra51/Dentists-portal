import React, { useState } from "react";

import {
  Calendar,
  Clock,
  DollarSign,
  Search,
  Trash2,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Archive,
  Eye,
  Phone,
  Mail,
  CalendarCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useDeleteArchivedAppointmentMutation,
  useGetAllAppointmentsQuery,
} from "../../../redux/api/appointmentApi";
import LoadingState from "../../../Components/states/LoadingState";
import DashboardHeader from "../../../Components/DashboardHeader";

const AllAppointments = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const { data, isLoading, refetch } = useGetAllAppointmentsQuery({
    status: statusFilter,
  });

  const [deleteAppointment, { isLoading: isDeleting }] =
    useDeleteArchivedAppointmentMutation();

  const handleDelete = async (appointmentId, bookingId) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${bookingId}? This action cannot be undone.`
      )
    ) {
      try {
        await deleteAppointment(appointmentId).unwrap();
        toast.success("Appointment deleted successfully");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete appointment");
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { color: "bg-blue-100 text-blue-700", icon: Clock },
      confirmed: { color: "bg-green-100 text-green-700", icon: CheckCircle },
      completed: { color: "bg-purple-100 text-purple-700", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-700", icon: XCircle },
      archived: { color: "bg-gray-100 text-gray-700", icon: Archive },
      "no-show": { color: "bg-orange-100 text-orange-700", icon: AlertCircle },
      "follow-up": { color: "bg-cyan-100 text-cyan-700", icon: Calendar },
    };

    const config = statusConfig[status] || statusConfig.scheduled;
    const Icon = config.icon;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.color} flex items-center gap-1 w-fit`}>
        <Icon size={14} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus) => {
    return paymentStatus === "paid" ? (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Paid
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        Pending
      </span>
    );
  };

  const filteredAppointments = data?.data?.filter((appointment) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "archived" && appointment.status === "archived") ||
      (activeTab === "active" && appointment.status !== "archived");

    const matchesSearch =
      searchQuery === "" ||
      appointment.patientId.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctorId.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  if (isLoading) {
    return (
      <LoadingState
        message="Loading all appointments..."
        spinnerColor="border-[#5ecdc9]"
        height={"min-h-screen"}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1440px] mx-auto">
      <div className="flex justify-between items-start">
        <DashboardHeader
          icon={CalendarCheck}
          title="All Appointments"
          subtitle={`Showing ${filteredAppointments.length} of ${filteredAppointments.length} appointments`}
        />
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by patient, doctor, or booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none">
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3">
        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {["all", "active", "archived"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 font-medium transition-colors ${
                activeTab === tab
                  ? "text-cyan-600 border-b-2 border-cyan-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
                {tab === "all"
                  ? data?.data?.length || 0
                  : tab === "archived"
                  ? data?.data?.filter((a) => a.status === "archived").length ||
                    0
                  : data?.data?.filter((a) => a.status !== "archived").length ||
                    0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Patient
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Doctor
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredAppointments?.map((appointment) => (
                <tr
                  key={appointment._id}
                  className="hover:bg-gray-50 transition-colors">
                  {/* Booking ID */}
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {appointment.bookingId}
                    </p>
                    {appointment.prescription && (
                      <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <CheckCircle size={12} />
                        Prescription Available
                      </span>
                    )}
                  </td>

                  {/* Patient */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          appointment.patientId.profileImage ||
                          "/default-avatar.png"
                        }
                        alt={appointment.patientId.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {appointment.patientId.name}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone size={12} />
                          {appointment.patientId.phone}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Doctor */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          appointment.doctorId.profileImage ||
                          "/default-avatar.png"
                        }
                        alt={appointment.doctorId.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {appointment.doctorId.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {appointment.doctorId.specialization}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 flex items-center gap-2">
                      <Calendar size={16} className="text-cyan-600" />
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <Clock size={14} />
                      {appointment.appointmentTime}
                    </p>
                  </td>

                  {/* Service */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">
                      {appointment.service}
                    </p>
                    <p className="text-xs text-gray-500">
                      {appointment.duration} min
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {getStatusBadge(appointment.status)}
                  </td>

                  {/* Payment */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {getPaymentBadge(appointment.payment.paymentStatus)}
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <DollarSign size={14} />
                        {appointment.payment.consultationFee}
                      </p>
                      <p className="text-xs text-gray-500">
                        {appointment.payment.paymentMethod || "N/A"}
                      </p>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedAppointment(appointment)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details">
                        <Eye size={18} className="text-gray-600" />
                      </button>
                      {appointment.status === "archived" && (
                        <button
                          onClick={() =>
                            handleDelete(appointment._id, appointment.bookingId)
                          }
                          disabled={isDeleting}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Permanently">
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAppointments?.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No appointments found</p>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Appointment Details
              </h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-500 hover:text-gray-700">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient & Doctor Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <User size={18} />
                    Patient Information
                  </h3>
                  <img
                    src={selectedAppointment.patientId.profileImage}
                    alt={selectedAppointment.patientId.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <p className="font-medium">
                    {selectedAppointment.patientId.name}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail size={14} />
                    {selectedAppointment.patientId.email}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone size={14} />
                    {selectedAppointment.patientId.phone}
                  </p>
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                    {selectedAppointment.patientId.bloodGroup}
                  </span>
                </div>

                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700">
                    Doctor Information
                  </h3>
                  <img
                    src={selectedAppointment.doctorId.profileImage}
                    alt={selectedAppointment.doctorId.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <p className="font-medium">
                    {selectedAppointment.doctorId.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedAppointment.doctorId.specialization}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedAppointment.doctorId.department}
                  </p>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-gray-700">
                  Appointment Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="font-medium">
                      {selectedAppointment.bookingId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-medium">{selectedAppointment.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {new Date(
                        selectedAppointment.appointmentDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">
                      {selectedAppointment.appointmentTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    {getStatusBadge(selectedAppointment.status)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment</p>
                    {getPaymentBadge(selectedAppointment.payment.paymentStatus)}
                  </div>
                </div>
              </div>

              {/* Audit Log */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Activity Timeline
                </h3>
                <div className="space-y-3">
                  {selectedAppointment.auditLog.map((log, index) => (
                    <div
                      key={log._id}
                      className="flex gap-3 items-start border-l-2 border-cyan-500 pl-4">
                      <div className="flex-1">
                        <p className="font-medium capitalize">{log.action}</p>
                        <p className="text-sm text-gray-600">{log.note}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(log.performedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAppointments;
