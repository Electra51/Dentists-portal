import React from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  User,
  FileText,
  Activity,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGetPatientAppointmentsQuery } from "../../../redux/api/appointmentApi";
import PrimaryButton from "../../../Components/PrimaryButton";
import DashboardHeader from "../../../Components/DashboardHeader";
import StatsCard from "../../../Components/StatsCard";

const PatientDashboard = () => {
  const { data: appointmentsData, isLoading } =
    useGetPatientAppointmentsQuery();
  const appointments = appointmentsData?.data || [];

  const totalAppointments = appointments.length;
  const scheduledAppointments = appointments.filter(
    (apt) => apt.status?.toLowerCase() === "scheduled"
  ).length;
  const completedAppointments = appointments.filter(
    (apt) => apt.status?.toLowerCase() === "completed"
  ).length;
  const cancelledAppointments = appointments.filter(
    (apt) => apt.status?.toLowerCase() === "cancelled"
  ).length;

  // Get upcoming appointments (next 3)
  const upcomingAppointments = appointments
    .filter((apt) => apt.status?.toLowerCase() === "scheduled")
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 3);

  // Get recent appointments (last 3 completed)
  const recentAppointments = appointments
    .filter((apt) => apt.status?.toLowerCase() === "completed")
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
    .slice(0, 3);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto p-5 md:p-7">
      <DashboardHeader
        icon={LayoutDashboard}
        title=" My Dashboard"
        subtitle="Welcome back! Here's your appointment overview"
      />

      {/* stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Appointments"
          value={totalAppointments}
          subtitle="All time bookings"
          icon={Calendar}
          gradientFrom="from-blue-500"
          gradientTo="to-blue-600"
        />

        <StatsCard
          title="Upcoming"
          value={scheduledAppointments}
          subtitle="Scheduled appointments"
          icon={Clock}
          gradientFrom="from-cyan-500"
          gradientTo="to-cyan-600"
        />

        <StatsCard
          title="Completed"
          value={completedAppointments}
          subtitle="Visits completed"
          icon={CheckCircle}
          gradientFrom="from-green-500"
          gradientTo="to-green-600"
        />

        <StatsCard
          title="Cancelled"
          value={cancelledAppointments}
          subtitle="Cancelled bookings"
          icon={XCircle}
          gradientFrom="from-red-500"
          gradientTo="to-red-600"
        />
      </div>
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Upcoming Appointments
              </h2>
            </div>
            <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold">
              {scheduledAppointments} Scheduled
            </span>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-cyan-500 border-t-transparent"></div>
              <p className="text-gray-500 mt-2">Loading...</p>
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No upcoming appointments</p>
              <Link to={"/appointment"}>
                <PrimaryButton>Book Appointment</PrimaryButton>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-800">
                        Dr. {appointment.doctorName}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {appointment.doctorSpecialization}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-cyan-600 text-white rounded text-xs font-semibold">
                      Scheduled
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-cyan-600" />
                      <span>{formatDate(appointment.appointmentDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-cyan-600" />
                      <span>{appointment.appointmentTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">Recent Visits</h2>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              {completedAppointments} Completed
            </span>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
              <p className="text-gray-500 mt-2">Loading...</p>
            </div>
          ) : recentAppointments.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No completed appointments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-800">
                        Dr. {appointment.doctorName}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {appointment.doctorSpecialization}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-semibold">
                      Completed
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span>{formatDate(appointment.appointmentDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 font-medium">
                        {appointment?.payment?.paymentStatus === "paid"
                          ? "Paid"
                          : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl shadow-sm border border-cyan-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/appointment"
            className="p-4 bg-white rounded-lg border-2 border-cyan-200 hover:border-cyan-400 hover:shadow-md transition-all text-left group">
            <Calendar className="w-8 h-8 text-cyan-600 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-gray-800 mb-1">Book Appointment</h3>
            <p className="text-sm text-gray-600">Schedule a new dental visit</p>
          </Link>

          <Link
            to="my-appointments"
            className="p-4 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all text-left group">
            <FileText className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-gray-800 mb-1">View Appointments</h3>
            <p className="text-sm text-gray-600">See all your bookings</p>
          </Link>

          <Link
            to="profile"
            className="p-4 bg-white rounded-lg border-2 border-purple-200 hover:border-purple-400 hover:shadow-md transition-all text-left group">
            <User className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-gray-800 mb-1">My Profile</h3>
            <p className="text-sm text-gray-600">Update your information</p>
          </Link>
        </div>
      </div>
      {/* Important Note */}
      <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <FileText className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-bold text-yellow-900 mb-1">
              Payment Information
            </h3>
            <p className="text-sm text-yellow-800">
              Please note: Consultation fees are to be paid at the clinic during
              your visit. After payment, the doctor will update your payment
              status in the system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
