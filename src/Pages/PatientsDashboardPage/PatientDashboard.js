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
import { useGetPatientAppointmentsQuery } from "../../redux/api/appointmentApi";

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
    <div className="min-h-screen max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <LayoutDashboard className="w-8 h-8 text-[#5ecdc9]" />
          My Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's your appointment overview
        </p>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Appointments */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">{totalAppointments}</span>
          </div>
          <h3 className="text-blue-100 text-sm font-medium mb-1">
            Total Appointments
          </h3>
          <p className="text-xs text-blue-200">All time bookings</p>
        </div>

        {/* Scheduled Appointments */}
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">{scheduledAppointments}</span>
          </div>
          <h3 className="text-cyan-100 text-sm font-medium mb-1">Upcoming</h3>
          <p className="text-xs text-cyan-200">Scheduled appointments</p>
        </div>

        {/* Completed Appointments */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">{completedAppointments}</span>
          </div>
          <h3 className="text-green-100 text-sm font-medium mb-1">Completed</h3>
          <p className="text-xs text-green-200">Visits completed</p>
        </div>

        {/* Cancelled Appointments */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <XCircle className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold">{cancelledAppointments}</span>
          </div>
          <h3 className="text-red-100 text-sm font-medium mb-1">Cancelled</h3>
          <p className="text-xs text-red-200">Cancelled bookings</p>
        </div>
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
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-medium">
                Book Appointment
              </button>
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
                        {appointment.paymentStatus === "PAID"
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
      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl shadow-sm border border-cyan-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white rounded-lg border-2 border-cyan-200 hover:border-cyan-400 hover:shadow-md transition-all text-left group">
            <Calendar className="w-8 h-8 text-cyan-600 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-gray-800 mb-1">Book Appointment</h3>
            <p className="text-sm text-gray-600">Schedule a new dental visit</p>
          </button>

          <button className="p-4 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all text-left group">
            <FileText className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-gray-800 mb-1">View Appointments</h3>
            <p className="text-sm text-gray-600">See all your bookings</p>
          </button>

          <button className="p-4 bg-white rounded-lg border-2 border-purple-200 hover:border-purple-400 hover:shadow-md transition-all text-left group">
            <User className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-gray-800 mb-1">My Profile</h3>
            <p className="text-sm text-gray-600">Update your information</p>
          </button>
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
