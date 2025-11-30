/* eslint-disable react-hooks/exhaustive-deps */
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
  Eye,
  FileText,
  DollarSign,
  Activity,
  MessageSquare,
  Download,
  CalendarCheck,
  Trash2,
  RotateCcw,
  Archive,
  AlertTriangle,
} from "lucide-react";

import toast from "react-hot-toast";
import LoadingState from "../../../../Components/states/LoadingState";
import FormattedDate from "../../../../Components/DateTimeFormate/FormattedDate";
import DashboardHeader from "../../../../Components/DashboardHeader";
import EmptyState from "../../../../Components/states/EmptyState";
import {
  useGetDoctorAppointmentsQuery,
  useConfirmAppointmentMutation,
  useMarkAsNoShowMutation,
  useDeleteAppointmentMutation,
  useArchiveExpiredAppointmentsMutation,
} from "../../../../redux/api/appointmentApi";
import getStatusBadge from "../../../../Components/Badge/getStatusBadge";
import getPaymentBadge from "../../../../Components/Badge/getPaymentBadge";
import { Link } from "react-router-dom";
import Avatar from "../../../../Components/Avatar/Avatar";
import PrimaryButton from "../../../../Components/PrimaryButton";
import { getHoursPassed } from "../../../../Utils/getHoursPassed";
import { isAppointmentExpired } from "../../../../Utils/isAppointmentExpired";

export default function DentistsAppointmentList() {
  const [activeTab, setActiveTab] = useState("today");
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const { data, isLoading, refetch } = useGetDoctorAppointmentsQuery({
    date: selectedDate,
    status: statusFilter === "all" ? "" : statusFilter,
  });

  const [confirmAppointment, { isLoading: isConfirming }] =
    useConfirmAppointmentMutation();
  const [markAsNoShow, { isLoading: isMarkingNoShow }] =
    useMarkAsNoShowMutation();
  const [deleteAppointment, { isLoading: isDeleting }] =
    useDeleteAppointmentMutation();
  const [archiveAppointment, { isLoading: isArchiving }] =
    useArchiveExpiredAppointmentsMutation();
  const appointments = data?.data || [];

  // Handler: Archive appointment
  const handleArchive = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to archive this appointment?")) {
      return;
    }

    try {
      await archiveAppointment(appointmentId).unwrap();
      toast.success("Appointment archived successfully");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to archive appointment");
    }
  };

  // Filter appointments by active tab
  const filteredByTab = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === "today") {
      return appointments.filter((apt) => {
        const aptDate = new Date(apt.appointmentDate);
        aptDate.setHours(0, 0, 0, 0);
        const isToday = aptDate.getTime() === today.getTime();
        const isActiveStatus = ["scheduled", "confirmed"].includes(apt.status);
        return isToday && isActiveStatus;
      });
    } else if (activeTab === "followup") {
      return appointments.filter((apt) => {
        const hasPrescription =
          apt.prescription !== null && apt.prescription !== undefined;
        const hasNextVisit = hasPrescription && apt.prescription.nextVisit;

        return hasNextVisit;
      });
    } else if (activeTab === "archived") {
      return appointments.filter((apt) => {
        if (apt.status === "no-show" || apt.status === "archived") return true;

        const isExpired = isAppointmentExpired(
          apt.appointmentDate,
          apt.appointmentTime
        );
        return apt.status === "cancelled" && isExpired;
      });
    }
    return appointments;
  }, [appointments, activeTab]);

  // Apply search and payment filters
  const filteredAppointments = useMemo(() => {
    return filteredByTab.filter((apt) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = apt.patientInfo.name
          ?.toLowerCase()
          .includes(searchLower);
        const emailMatch = apt.patientId?.email
          ?.toLowerCase()
          .includes(searchLower);
        const phoneMatch = apt.patientInfo.phone?.includes(searchTerm);
        if (!nameMatch && !emailMatch && !phoneMatch) return false;
      }

      if (paymentFilter === "paid" && apt.payment.paymentStatus !== "paid")
        return false;
      if (
        paymentFilter === "pending" &&
        apt.payment.paymentStatus !== "pending"
      )
        return false;

      return true;
    });
  }, [filteredByTab, searchTerm, paymentFilter]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const today = new Date();
    const todayDateString = today.toLocaleDateString("en-CA");

    const todayAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      const aptDateString = aptDate.toLocaleDateString("en-CA");

      const isToday = aptDateString === todayDateString;
      const isActiveStatus = ["scheduled", "confirmed"].includes(apt.status);

      const isExpired = isAppointmentExpired(
        apt.appointmentDate,
        apt.appointmentTime
      );

      return isToday && isActiveStatus && !isExpired;
    });

    const confirmedToday = todayAppointments.filter(
      (apt) => apt.status === "confirmed"
    ).length;

    // const followUps = appointments.filter(
    //   (apt) => apt.status === "follow-up"
    // ).length;

    const followUps = appointments.filter((apt) => {
      const hasPrescription =
        apt.prescription !== null && apt.prescription !== undefined;
      const hasNextVisit = hasPrescription && apt.prescription.nextVisit;

      return hasNextVisit;
    }).length;

    const totalRevenue = appointments
      .filter((apt) => apt.payment.paymentStatus === "paid")
      .reduce((sum, apt) => sum + apt.payment.paidAmount, 0);

    const pendingRevenue = appointments
      .filter((apt) => apt.payment.paymentStatus === "pending")
      .reduce((sum, apt) => sum + apt.payment.consultationFee, 0);

    const archivedCount = appointments.filter((apt) => {
      if (apt.status === "no-show" || apt.status === "archived") return true;

      const isExpired = isAppointmentExpired(
        apt.appointmentDate,
        apt.appointmentTime
      );

      if (["scheduled", "confirmed"].includes(apt.status) && isExpired) {
        return true;
      }

      return apt.status === "cancelled" && isExpired;
    }).length;

    return {
      todayCount: todayAppointments.length,
      confirmedToday,
      followUps,
      totalRevenue,
      pendingRevenue,
      archivedCount,
      paidCount: appointments.filter(
        (apt) => apt.payment.paymentStatus === "paid"
      ).length,
      unpaidCount: appointments.filter(
        (apt) => apt.payment.paymentStatus === "pending"
      ).length,
    };
  }, [appointments]);

  // Handler: Confirm appointment
  const handleConfirm = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to confirm this appointment?")) {
      return;
    }

    try {
      await confirmAppointment(appointmentId).unwrap();
      toast.success("Appointment confirmed successfully");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to confirm appointment");
    }
  };

  // Handler: Mark as no-show
  const handleNoShow = async (appointmentId) => {
    const reason = window.prompt(
      "Reason for no-show (optional):",
      "Patient did not show up"
    );
    if (reason === null) return;

    try {
      await markAsNoShow({ appointmentId, reason }).unwrap();
      toast.success("Appointment marked as no-show");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to mark as no-show");
    }
  };

  // Handler: Delete appointment
  const handleDelete = async (appointmentId, patientName) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete ${patientName}'s appointment? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteAppointment(appointmentId).unwrap();
      toast.success("Appointment deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete appointment");
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        message="Loading appointments..."
        spinnerColor="border-[#5ecdc9]"
        height="min-h-screen"
      />
    );
  }

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto p-5 md:p-7">
      <DashboardHeader
        icon={CalendarCheck}
        title="Appointments Management"
        subtitle="View and manage all your dental appointments efficiently"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("today")}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
              activeTab === "today"
                ? "text-cyan-600 border-b-2 border-cyan-600"
                : "text-gray-600 hover:text-gray-900"
            }`}>
            <Calendar className="w-5 h-5" />
            Today's Appointments
            {statistics.todayCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-cyan-100 text-cyan-700 rounded-full">
                {statistics.todayCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("followup")}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
              activeTab === "followup"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}>
            <RotateCcw className="w-5 h-5" />
            Follow-ups
            {statistics.followUps > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-purple-100 text-purple-700 rounded-full">
                {statistics.followUps}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("archived")}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
              activeTab === "archived"
                ? "text-gray-600 border-b-2 border-gray-600"
                : "text-gray-600 hover:text-gray-900"
            }`}>
            <Archive className="w-5 h-5" />
            Archived
            {statistics.archivedCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-gray-200 text-gray-700 rounded-full">
                {statistics.archivedCount}
              </span>
            )}
          </button>
        </div>

        <div className="p-6">
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
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="follow-up">Follow-up</option>
                <option value="no-show">Patient absent</option>
                <option value="cancelled">Cancelled</option>
                <option value="archived">Archived</option>
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
              onClick={() => {
                setSelectedDate("");
                setStatusFilter("all");
                setSearchTerm("");
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
              appointments
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <EmptyState
            icon={
              activeTab === "today"
                ? Calendar
                : activeTab === "followup"
                ? RotateCcw
                : Archive
            }
            title={
              activeTab === "today"
                ? "No Today's Appointments"
                : activeTab === "followup"
                ? "No Follow-ups Scheduled"
                : "No Archived Appointments"
            }
            message={
              searchTerm
                ? "Try adjusting your filters"
                : activeTab === "today"
                ? "No appointments scheduled for today"
                : activeTab === "followup"
                ? "No follow-up appointments scheduled"
                : "No archived appointments found"
            }
          />
        ) : (
          filteredAppointments.map((appointment) => {
            const isExpired = isAppointmentExpired(
              appointment.appointmentDate,
              appointment.appointmentTime
            );

            const hoursPassed = getHoursPassed(
              appointment.appointmentDate,
              appointment.appointmentTime
            );

            const showTimeOverWarning = hoursPassed >= 4 && isExpired;
            console.log("showTimeOverWarning", showTimeOverWarning, isExpired);

            const canDelete =
              (appointment.status === "cancelled" ||
                appointment.status === "completed" ||
                appointment.status === "no-show" ||
                appointment.status === "archived") &&
              isExpired;

            return (
              <div
                key={appointment._id}
                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all border ${
                  showTimeOverWarning
                    ? "border-red-300 ring-2 ring-red-100"
                    : "border-gray-200"
                }`}>
                {showTimeOverWarning && appointment.status !== "completed" && (
                  <div
                    className={`${
                      appointment.status !== "completed"
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : ""
                    }  text-white px-6 py-3 flex items-center gap-3 rounded-t-xl`}>
                    <AlertTriangle className="w-5 h-5 animate-pulse " />
                    <span className="font-bold text-sm">
                      Time Over: {Math.floor(hoursPassed)} hours passed since
                      appointment time
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex flex-col lg:flex-row items-start gap-4">
                    <div className="flex items-start gap-4 flex-1 w-full">
                      <div>
                        {appointment.patientId?.profileImage ? (
                          <Avatar
                            name={appointment.patientId.name}
                            src={appointment.patientId.profileImage}
                            size="md"
                            status="online"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 shadow-md">
                            <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                              {appointment.patientInfo.name
                                ?.charAt(0)
                                .toUpperCase()}
                            </div>
                          </div>
                        )}
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
                              {appointment.patientId?.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            {appointment.patientInfo.phone}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Activity className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            Blood: {appointment.patientId?.bloodGroup || "N/A"}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <FormattedDate date={appointment.appointmentDate} />
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            {appointment.appointmentTime} (
                            {appointment.duration} min)
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
                            <DollarSign className="w-4 h-4" />৳
                            {appointment.payment.consultationFee}
                          </div>
                          {getPaymentBadge(
                            appointment.payment.paymentStatus,
                            appointment.payment.paymentMethod
                          )}
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

                    <div className="flex flex-col gap-2 lg:ml-4 w-full lg:w-auto lg:min-w-[200px]">
                      {appointment.status === "scheduled" &&
                        !showTimeOverWarning && (
                          <button
                            onClick={() => handleConfirm(appointment._id)}
                            disabled={isConfirming}
                            className="w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm font-medium">
                            <CheckCircle className="w-4 h-4" />
                            {isConfirming ? "Confirming..." : "Confirm"}
                          </button>
                        )}

                      {appointment.status === "scheduled" &&
                        showTimeOverWarning && (
                          <button
                            onClick={() => handleArchive(appointment._id)}
                            disabled={isArchiving}
                            className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm font-medium">
                            <Archive className="w-4 h-4" />
                            {isArchiving ? "Archiving..." : "Archive"}
                          </button>
                        )}

                      {appointment.status === "confirmed" && (
                        <button
                          onClick={() => handleNoShow(appointment._id)}
                          disabled={isMarkingNoShow}
                          className="w-full px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm font-medium">
                          <XCircle className="w-4 h-4" />
                          {isMarkingNoShow ? "Marking..." : "Patient absent"}
                        </button>
                      )}

                      <Link to={`${appointment._id}`}>
                        <PrimaryButton className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </PrimaryButton>
                      </Link>

                      {canDelete && (
                        <button
                          onClick={() =>
                            handleDelete(
                              appointment._id,
                              appointment.patientInfo.name
                            )
                          }
                          disabled={isDeleting}
                          className="w-full px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm font-medium">
                          <Trash2 className="w-4 h-4" />
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
