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
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useGetPatientAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
} from "../../../redux/api/appointmentApi";
import PrimaryButton from "../../../Components/PrimaryButton";
import DashboardHeader from "../../../Components/DashboardHeader";
import LoadingState from "../../../Components/states/LoadingState";
import MessageState from "../../../Components/states/MessageState";
import EmptyState from "../../../Components/states/EmptyState";
import FormattedDate from "../../../Components/DateTimeFormate/FormattedDate";
import FormattedTime from "../../../Components/DateTimeFormate/FormattedTime";

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
    console.log("stst", status);

    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "refunded":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "failed":
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

  if (isLoading) {
    return (
      <LoadingState
        message="Loading appointments..."
        spinnerColor="border-[#5ecdc9]"
        height={"min-h-screen"}
      />
    );
  }

  if (isError) {
    return (
      <MessageState
        type="error"
        title="Unable to Load appointments"
        message="Please try refreshing the page or contact support if the problem persists."
      />
    );
  }
  return (
    <div className="min-h-screen max-w-[1440px] mx-auto p-5 md:p-7">
      <DashboardHeader
        icon={CalendarCheck}
        title="My Appointments"
        subtitle="View and manage all your dental appointments"
      />

      {/* appointments list */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Appointments Found"
            message="You haven't booked any appointments yet">
            <Link to="/appointment">
              <PrimaryButton>
                <Calendar className="w-4 h-4 mr-2" />
                Book New Appointment
              </PrimaryButton>
            </Link>
          </EmptyState>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-200 hover:border-cyan-300">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-cyan-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Date & Time
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      <FormattedDate date={appointment.appointmentDate} /> •{" "}
                      <FormattedTime timeString={appointment.appointmentTime} />
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-cyan-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Service</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {appointment.service || "Dental Consultation"}
                    </p>
                  </div>
                </div>

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

              <div
                className="mb-4 p-3 rounded-lg border-2 border-dashed flex items-center justify-between"
                style={{
                  borderColor:
                    appointment?.payment?.paymentStatus === "paid"
                      ? "#10b981"
                      : "#eab308",
                  backgroundColor:
                    appointment?.payment?.paymentStatus === "paid"
                      ? "#f0fdf4"
                      : "#fefce8",
                }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {appointment?.payment?.paymentStatus === "paid"
                      ? "💳"
                      : "⏳"}
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color:
                        appointment?.payment?.paymentStatus === "paid"
                          ? "#166534"
                          : "#854d0e",
                    }}>
                    Payment Status:
                  </span>
                </div>

                <span
                  className={`flex items-center gap-1 px-2 py-1 border rounded-md text-sm ${getPaymentStatusColor(
                    appointment?.payment?.paymentStatus
                  )}`}>
                  {appointment?.payment?.paymentStatus}
                  {appointment?.payment?.paymentStatus === "paid" && (
                    <Check size={16} />
                  )}
                </span>
              </div>

              <div className="flex gap-3">
                {appointment.status === "scheduled" && (
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
    </div>
  );
};

export default MyAppointmentPage;
