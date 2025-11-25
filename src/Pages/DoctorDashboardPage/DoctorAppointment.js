/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Eye,
  FileText,
  Timer,
  TrendingUp,
  DollarSign,
  Activity,
  MessageSquare,
  AlertTriangle,
  Download,
  Plus,
} from "lucide-react";
import {
  useGetDoctorAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
} from "../../redux/api/doctorApi";
import toast from "react-hot-toast";
import { Modal } from "../../Components/Modal";
import PrescriptionForm from "./PrescriptionForm";
import { useMarkPaymentReceivedMutation } from "../../redux/api/appointmentApi";
import PaymentModal from "./PaymentModal";

export default function DoctorAppointment() {
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentAppointment, setSelectedPaymentAppointment] =
    useState(null);

  const { data, isLoading, refetch } = useGetDoctorAppointmentsQuery({
    date: selectedDate,
    status: statusFilter === "all" ? "" : statusFilter,
    search: searchQuery,
  });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateAppointmentStatusMutation();
  // ✅ Payment Mutation
  const [markPayment, { isLoading: isMarkingPayment }] =
    useMarkPaymentReceivedMutation();
  const appointments = data?.data || [];
  // ✅ Handle Payment Modal Open
  const handleOpenPaymentModal = (appointment) => {
    setSelectedPaymentAppointment(appointment);
    setIsPaymentModalOpen(true);
  };

  // ✅ Handle Payment Update
  const handleMarkAsPaid = async (appointmentId, amount, note) => {
    try {
      await markPayment({ appointmentId, amount, note }).unwrap();
      toast.success("Payment marked as received!");
      setIsPaymentModalOpen(false);
      setSelectedPaymentAppointment(null);
      refetch();
    } catch (error) {
      console.error("Payment update error:", error);
      toast.error(error?.data?.message || "Failed to update payment");
    }
  };

  // ✅ Handle Prescription Success - Refetch appointments if needed
  const handlePrescriptionSuccess = (prescriptionData) => {
    console.log("Prescription created:", prescriptionData);
    // Optionally refetch appointments or update UI
    toast.success("Prescription created successfully!");
  };

  // ✅ Handle Open Prescription Modal
  const handleOpenPrescriptionModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  // ✅ Handle Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  // Statistics calculation
  const statistics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate.getTime() === today.getTime();
    });

    const totalRevenue = appointments
      .filter((apt) => apt.payment.paymentStatus === "paid")
      .reduce((sum, apt) => sum + apt.payment.paidAmount, 0);

    const pendingRevenue = appointments
      .filter((apt) => apt.payment.paymentStatus === "pending")
      .reduce((sum, apt) => sum + apt.payment.consultationFee, 0);

    return {
      total: appointments.length,
      today: todayAppointments.length,
      pending: appointments.filter((apt) => apt.status === "pending").length,
      confirmed: appointments.filter((apt) => apt.status === "confirmed")
        .length,
      completed: appointments.filter((apt) => apt.status === "completed")
        .length,
      cancelled: appointments.filter((apt) => apt.status === "cancelled")
        .length,
      totalRevenue,
      pendingRevenue,
      paidAppointments: appointments.filter(
        (apt) => apt.payment.paymentStatus === "paid"
      ).length,
    };
  }, [appointments]);

  const today = new Date().toISOString().split("T")[0];

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    if (
      !window.confirm(`Are you sure you want to ${newStatus} this appointment?`)
    ) {
      return;
    }

    try {
      await updateStatus({ appointmentId, status: newStatus }).unwrap();
      toast.success(`Appointment ${newStatus} successfully`);
      refetch();
      setSelectedAppointment(null);
    } catch (error) {
      toast.error(`Failed to ${newStatus} appointment`);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: <AlertCircle className="w-4 h-4" />,
        label: "Pending",
      },
      scheduled: {
        bg: "bg-blue-100 border-blue-200",
        text: "text-blue-700",
        icon: <Timer className="w-4 h-4" />,
        label: "Scheduled",
      },
      confirmed: {
        bg: "bg-cyan-100",
        text: "text-cyan-700",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Confirmed",
      },
      completed: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Completed",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-700",
        icon: <XCircle className="w-4 h-4" />,
        label: "Cancelled",
      },
      "no-show": {
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: <XCircle className="w-4 h-4" />,
        label: "No Show",
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

  const getPaymentBadge = (paymentStatus, paymentMethod) => {
    if (paymentStatus === "paid") {
      return (
        <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          Paid ({paymentMethod})
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Pending
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (paymentFilter === "paid" && apt.payment.paymentStatus !== "paid")
        return false;
      if (
        paymentFilter === "pending" &&
        apt.payment.paymentStatus !== "pending"
      )
        return false;
      return true;
    });
  }, [appointments, paymentFilter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <Calendar className="w-8 h-8 text-cyan-500" />
          My Appointments
        </h1>
        <p className="text-gray-600">
          Manage and track your appointments efficiently
        </p>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-xl border border-cyan-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cyan-700 font-medium">
                Today's Appointments
              </p>
              <p className="text-2xl font-bold text-cyan-900">
                {statistics.today}
              </p>
              <p className="text-xs text-cyan-600 mt-1">
                {statistics.confirmed} confirmed
              </p>
            </div>
            <Calendar className="w-10 h-10 text-cyan-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">
                {statistics.pending}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Awaiting confirmation
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-green-900">
                $ {statistics.totalRevenue}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {statistics.paidAppointments} paid appointments
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 font-medium">
                Pending Revenue
              </p>
              <p className="text-2xl font-bold text-orange-900">
                $ {statistics.pendingRevenue}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                {appointments.length - statistics.paidAppointments} unpaid
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none">
              <option value="all">All Payments</option>
              <option value="paid">Paid Only</option>
              <option value="pending">Pending Only</option>
            </select>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setSelectedDate(today)}
            className="px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors font-medium">
            Today's Appointments
          </button>
          <button
            onClick={() => {
              setSelectedDate("");
              setStatusFilter("all");
              setSearchQuery("");
              setPaymentFilter("all");
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            Clear All Filters
          </button>
          <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <div className="ml-auto text-sm text-gray-600 font-medium">
            Showing{" "}
            <span className="text-cyan-600 font-bold">
              {filteredAppointments.length}
            </span>{" "}
            of <span className="font-bold">{appointments.length}</span>{" "}
            appointments
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  {/* Patient Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                      {appointment.patientInfo.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-gray-900">
                          {appointment.patientInfo.name}
                        </h3>
                        {getStatusBadge(appointment.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">
                            {appointment.patientId.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          {appointment.patientId.phone}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Activity className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          Blood: {appointment.patientId.bloodGroup}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          {formatDate(appointment.appointmentDate)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          {appointment.appointmentTime} ({appointment.duration}{" "}
                          min)
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          ID: {appointment.bookingId}
                        </div>
                      </div>

                      {/* Service & Payment Info */}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                          <FileText className="w-4 h-4" />
                          {appointment.service}
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                          <DollarSign className="w-4 h-4" />
                          {appointment.payment.consultationFee}
                        </div>
                      </div>

                      {/* Patient Notes */}
                      {appointment.patientNotes && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-900">
                            <span className="font-semibold flex items-center gap-2 mb-1">
                              <MessageSquare className="w-4 h-4" />
                              Patient Notes:
                            </span>
                            {appointment.patientNotes}
                          </p>
                        </div>
                      )}

                      {/* Expandable Section */}
                      {expandedAppointment === appointment._id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                          {appointment.doctorNotes && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-900">
                                <span className="font-semibold">
                                  Doctor Notes:
                                </span>{" "}
                                {appointment.doctorNotes}
                              </p>
                            </div>
                          )}

                          {appointment.symptoms?.length > 0 && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm text-red-900">
                                <span className="font-semibold">Symptoms:</span>{" "}
                                {appointment.symptoms.join(", ")}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4 flex-shrink-0">
                    {appointment.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(appointment._id, "confirmed")
                          }
                          disabled={isUpdating}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm">
                          <CheckCircle className="w-4 h-4" />
                          Confirm
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(appointment._id, "cancelled")
                          }
                          disabled={isUpdating}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm">
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    )}

                    {(appointment.status === "confirmed" ||
                      appointment.status === "scheduled") && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(appointment._id, "completed")
                          }
                          disabled={isUpdating}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm">
                          <CheckCircle className="w-4 h-4" />
                          Complete
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(appointment._id, "no-show")
                          }
                          disabled={isUpdating}
                          className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm">
                          <XCircle className="w-4 h-4" />
                          No Show
                        </button>
                      </>
                    )}

                    {appointment.status === "completed" && (
                      <button
                        onClick={() => setSelectedAppointment(appointment)}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all flex items-center gap-2 shadow-sm">
                        <Eye className="w-4 h-4" />
                        Details
                      </button>
                    )}

                    {/* ✅ Prescription Button - Show for confirmed/completed */}
                    {(appointment.status === "confirmed" ||
                      appointment.status === "completed") && (
                      <button
                        onClick={() => handleOpenPrescriptionModal(appointment)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center gap-2 shadow-sm">
                        <Plus className="w-4 h-4" />
                        Prescription
                      </button>
                    )}
                    {/* ✅ Mark as Paid Button - Only if payment is pending */}
                    {appointment.payment.paymentStatus === "pending" && (
                      <button
                        onClick={() => handleOpenPaymentModal(appointment)}
                        disabled={isMarkingPayment}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm">
                        <DollarSign className="w-4 h-4" />
                        Mark as Paid
                      </button>
                    )}
                    <button className="px-4 py-2 rounded-md border border-blue-300 transition-all flex items-center gap-2 shadow-sm">
                      <span className="font-medium">Payment Status:</span>
                      {getPaymentBadge(
                        appointment.payment.paymentStatus,
                        appointment.payment.paymentMethod
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Prescription Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create Prescription">
        <PrescriptionForm
          patientData={selectedAppointment}
          onCancel={handleCloseModal}
          onSuccess={handlePrescriptionSuccess}
        />
      </Modal>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          appointment={selectedPaymentAppointment}
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedPaymentAppointment(null);
          }}
          onConfirm={(appointmentId, amount, note) =>
            handleMarkAsPaid(appointmentId, amount, note)
          }
        />
      )}
    </div>
  );
}
