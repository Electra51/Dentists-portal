/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
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
  CalendarCheck,
} from "lucide-react";

import toast from "react-hot-toast";
import { Modal } from "../../../Components/Modal";
import PaymentModal from "./PaymentModal";
import PrescriptionForm from "./PrescriptionForm";
import LoadingState from "../../../Components/states/LoadingState";
import FormattedDate from "../../../Components/DateTimeFormate/FormattedDate";
import DashboardHeader from "../../../Components/DashboardHeader";
import StatsCard from "../../../Components/StatsCard";
import EmptyState from "../../../Components/states/EmptyState";
import {
  useGetDoctorAppointmentsQuery,
  useMarkPaymentReceivedMutation,
  useUpdateAppointmentStatusMutation,
} from "../../../redux/api/appointmentApi";

export default function DentistsAppointmentList() {
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentAppointment, setSelectedPaymentAppointment] =
    useState(null);

  const { data, isLoading, refetch } = useGetDoctorAppointmentsQuery({
    date: selectedDate,
    status: statusFilter === "all" ? "" : statusFilter,
    search: searchTerm,
  });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateAppointmentStatusMutation();

  const [markPayment, { isLoading: isMarkingPayment }] =
    useMarkPaymentReceivedMutation();

  const appointments = data?.data || [];

  const handleOpenPaymentModal = (appointment) => {
    setSelectedPaymentAppointment(appointment);
    setIsPaymentModalOpen(true);
  };

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

  const handlePrescriptionSuccess = (prescriptionData) => {
    console.log("Prescription created:", prescriptionData);
    toast.success("Prescription created successfully!");
  };

  const handleOpenPrescriptionModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

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
      <LoadingState
        message="Loading all appointments..."
        spinnerColor="border-[#5ecdc9]"
        height={"min-h-screen"}
      />
    );
  }

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto p-5 md:p-7">
      <DashboardHeader
        icon={CalendarCheck}
        title="Appointments List"
        subtitle="View and manage all your dental appointments efficiently"
      />

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Today's Appointments"
          value={statistics.today}
          subtitle={`${statistics.confirmed} confirmed`}
          icon={Calendar}
          gradientFrom="from-cyan-500"
          gradientTo="to-green-400"
        />

        <StatsCard
          title="Pending"
          value={statistics.pending}
          subtitle="Awaiting confirmation"
          icon={AlertCircle}
          gradientFrom="from-yellow-200"
          gradientTo="to-yellow-400"
        />

        <StatsCard
          title="Total Revenue"
          value={statistics.totalRevenue}
          subtitle={`${statistics.paidAppointments} paid appointments`}
          icon={DollarSign}
          gradientFrom="from-blue-400"
          gradientTo="to-cyan-300"
        />
        <StatsCard
          title="Pending Revenue"
          value={statistics.pendingRevenue}
          subtitle={`${
            appointments.length - statistics.paidAppointments
          } unpaid`}
          icon={TrendingUp}
          gradientFrom="from-orange-300"
          gradientTo="to-orange-400"
        />
      </div>

      {/* filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

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
              setsearchTerm("");
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

      {/* appointments list */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No appointments Found"
            message={
              searchTerm
                ? "Try adjusting your filters or check back later"
                : "You don't have any appointments yet"
            }
          />
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
                          <FormattedDate date={appointment.appointmentDate} />
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
                    </div>
                  </div>

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

                    {(appointment.status === "confirmed" ||
                      appointment.status === "completed") && (
                      <button
                        onClick={() => handleOpenPrescriptionModal(appointment)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center gap-2 shadow-sm">
                        <Plus className="w-4 h-4" />
                        Prescription
                      </button>
                    )}

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
