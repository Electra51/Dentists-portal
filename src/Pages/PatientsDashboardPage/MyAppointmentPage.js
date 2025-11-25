import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  CreditCard,
  User,
  X,
  Loader2,
  Building2,
  IdCard,
  CalendarCheck,
} from "lucide-react";
import { useGetPatientAppointmentsQuery } from "../../redux/api/appointmentApi";
import { useUpdateAppointmentStatusMutation } from "../../redux/api/appointmentApi";
import PrimaryButton from "../../Components/PrimaryButton";
import { Link } from "react-router-dom";

const MyAppointmentPage = () => {
  const [setSelectedAppointment] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const {
    data: appointmentsData,
    isLoading,
    isError,
    refetch,
  } = useGetPatientAppointmentsQuery();

  const [updateStatus] = useUpdateAppointmentStatusMutation();

  const appointments = appointmentsData?.data || [];

  // Handle cancel appointment
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      setCancellingId(appointmentId);
      await updateStatus({
        appointmentId,
        status: "cancelled",
        cancellationReason: "Cancelled by patient",
      }).unwrap();

      alert("Appointment cancelled successfully!");
      refetch();
      setSelectedAppointment(null);
    } catch (error) {
      alert("Failed to cancel appointment. Please try again.");
      console.error("Cancel error:", error);
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "no-show":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PAID":
        return "bg-green-100 text-green-700 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "REFUNDED":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "FAILED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "⏳";
      case "confirmed":
        return "✅";
      case "completed":
        return "✔️";
      case "cancelled":
        return "❌";
      case "no-show":
        return "⚠️";
      default:
        return "📋";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString;
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <CalendarCheck className="w-8 h-8 text-[#5ecdc9]" />
          My Appointments
        </h1>
        <p className="text-gray-600">
          View and manage all your dental appointments
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col justify-center items-center py-16">
          <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mb-4" />
          <p className="text-gray-600 text-lg">Loading appointments...</p>
        </div>
      )}

      {/* Appointments List */}
      {!isLoading && !isError && (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
              <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No Appointments Found
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't booked any appointments yet
              </p>
              <Link to={"/appointment"}>
                <PrimaryButton>
                  <Calendar className="w-4 h-4 mr-2" />
                  Book New Appointment
                </PrimaryButton>
              </Link>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-200 hover:border-cyan-300">
                {/* Header with Status */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⏰</span>
                    <h3 className="text-lg font-bold text-gray-800">
                      Appointment
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 ${getStatusColor(
                      appointment.status
                    )}`}>
                    <span>{getStatusIcon(appointment.status)}</span>
                    {appointment.status}
                  </span>
                </div>

                {/* Doctor Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-5 h-5 text-cyan-600" />
                    <h4 className="text-xl font-bold text-gray-800">
                      Dr. {appointment.doctorName}
                    </h4>
                  </div>
                  {appointment.doctorSpecialization && (
                    <p className="text-sm text-gray-600 ml-7">
                      {appointment.doctorSpecialization}
                    </p>
                  )}
                </div>

                {/* Appointment Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {/* Date & Time */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-cyan-600" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Date & Time
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {formatDate(appointment.appointmentDate)} •{" "}
                        {formatTime(appointment.appointmentTime)}
                      </p>
                    </div>
                  </div>

                  {/* Service */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-cyan-600" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Service
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {appointment.service || "Dental Consultation"}
                      </p>
                    </div>
                  </div>

                  {/* Booking ID */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <IdCard className="w-5 h-5 text-cyan-600" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Booking ID
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {appointment.bookingId || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Consultation Fee */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CreditCard className="w-5 h-5 text-cyan-600" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Consultation Fee
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        $ {appointment.payment?.consultationFee || "0"}{" "}
                        <span className="text-xs text-gray-500">
                          (Pay at clinic)
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                    <MapPin className="w-5 h-5 text-cyan-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        Location
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        House 15, Road No. 32, Dhanmondi Residential Area, Dhaka
                        1209
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Near Dhanmondi 32 Bus Stand
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Status Bar */}
                <div
                  className="mb-4 p-3 rounded-lg border-2 border-dashed flex items-center justify-between"
                  style={{
                    borderColor:
                      appointment.paymentStatus === "PAID"
                        ? "#10b981"
                        : "#eab308",
                    backgroundColor:
                      appointment.paymentStatus === "PAID"
                        ? "#f0fdf4"
                        : "#fefce8",
                  }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {appointment.paymentStatus === "PAID" ? "💳" : "⏳"}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color:
                          appointment.paymentStatus === "PAID"
                            ? "#166534"
                            : "#854d0e",
                      }}>
                      Payment Status:
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold border ${getPaymentStatusColor(
                      appointment.paymentStatus
                    )}`}>
                    {appointment.paymentStatus || "PENDING"}
                  </span>
                </div>

                {/* Action Button */}
                <div className="flex gap-3">
                  {appointment.status?.toLowerCase() === "scheduled" && (
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      disabled={cancellingId === appointment.id}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {cancellingId === appointment.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          Cancel Appointment
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyAppointmentPage;
