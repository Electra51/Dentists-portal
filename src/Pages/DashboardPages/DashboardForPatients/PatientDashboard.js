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
  TrendingUp,
  ClipboardList,
  CheckCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import PrimaryButton from "../../../Components/PrimaryButton";
import DashboardHeader from "../../../Components/DashboardHeader";
import StatsCard from "../../../Components/StatsCard";
import { useGetPatientDashboardQuery } from "../../../redux/api/dashboardApi";
import LoadingState from "../../../Components/states/LoadingState";
import MessageState from "../../../Components/states/MessageState";
import FormattedDate from "../../../Components/DateTimeFormate/FormattedDate";
import FormattedTime from "../../../Components/DateTimeFormate/FormattedTime";

const PatientDashboard = () => {
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useGetPatientDashboardQuery();
  console.log("dashboardData", dashboardData);

  const summary = dashboardData?.data?.summary || {};
  const nextAppointment = dashboardData?.data?.nextAppointment;
  const recentVisits = dashboardData?.data?.recentVisits || [];

  if (isLoading) {
    return (
      <LoadingState
        message="Loading Dashboard..."
        spinnerColor="border-[#5ecdc9]"
        height={"min-h-screen"}
      />
    );
  }

  if (isError) {
    return (
      <MessageState
        type="error"
        title="Unable to Load Dashboard"
        message="Please try refreshing the page or contact support if the problem persists."
      />
    );
  }

  const upcomingFollowUpVisits =
    summary.nextPrescriptionVisit?.nextVisit &&
    new Date(summary.nextPrescriptionVisit.nextVisit) > new Date()
      ? 1
      : 0;

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto p-5 md:p-7">
      <DashboardHeader
        icon={LayoutDashboard}
        title="My Dashboard"
        subtitle="Welcome back! Here's your appointment overview"
      />
      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* <StatsCard
          title="Total Appointments"
          value={summary.totalAppointments || 0}
          subtitle="All time bookings"
          icon={Calendar}
          gradientFrom="from-blue-400"
          gradientTo="to-blue-500"
        />
        <StatsCard
          title="Scheduled Appointments"
          value={summary.upcomingAppointments || 0}
          subtitle="Booked appointments"
          icon={Clock}
          gradientFrom="from-cyan-400"
          gradientTo="to-cyan-500"
        />
        <StatsCard
          title="Completed Visits"
          value={summary.completedVisits || 0}
          subtitle="Finished appointments"
          icon={CheckCircle}
          gradientFrom="from-cyan-400"
          gradientTo="to-blue-500"
        />
        <StatsCard
          title="Cancelled"
          value={summary.cancelledAppointments || 0}
          subtitle="Cancelled bookings"
          icon={XCircle}
          gradientFrom="from-red-400"
          gradientTo="to-orange-500"
        />
        <StatsCard
          title="Active Prescriptions"
          value={summary?.activePrescriptions}
          subtitle="Currently active"
          icon={FileText}
          gradientFrom="from-purple-400"
          gradientTo="to-blue-400"
        />
        <StatsCard
          title="Pending Payments"
          value={summary?.pendingPayments}
          subtitle="Payment required at clinic"
          icon={TrendingUp}
          gradientFrom="from-pink-500"
          gradientTo="to-cyan-400"
        />
        <StatsCard
          title="Follow-up Visits"
          value={upcomingVisits}
          subtitle="Prescribed next visits"
          icon={Calendar}
          gradientFrom="from-cyan-500"
          gradientTo="to-green-400"
        /> */}

        <StatsCard
          title="Total Appointments"
          value={summary.totalAppointments}
          subtitle="All time bookings"
          icon={Calendar}
          gradientFrom="from-blue-400"
          gradientTo="to-blue-600"
        />

        <StatsCard
          title="Scheduled Appointments"
          value={summary.upcomingAppointments}
          subtitle="Booked appointments"
          icon={Clock}
          gradientFrom="from-cyan-400"
          gradientTo="to-cyan-600"
        />

        <StatsCard
          title="Completed Visits"
          value={summary.completedVisits}
          subtitle="Finished appointments"
          icon={CheckCircle}
          gradientFrom="from-emerald-400"
          gradientTo="to-emerald-600"
        />

        <StatsCard
          title="Cancelled"
          value={summary.cancelledAppointments}
          subtitle="Cancelled bookings"
          icon={XCircle}
          gradientFrom="from-red-400"
          gradientTo="to-red-600"
        />

        {/* Row 2 */}
        <StatsCard
          title="Active Prescriptions"
          value={summary.activePrescriptions}
          subtitle="Currently active"
          icon={FileText}
          gradientFrom="from-purple-400"
          gradientTo="to-purple-600"
        />

        <StatsCard
          title="Pending Payments"
          value={summary.pendingPayments}
          subtitle="Payment at clinic"
          icon={TrendingUp}
          gradientFrom="from-pink-400"
          gradientTo="to-pink-600"
        />

        <StatsCard
          title="Follow-up Visits"
          value={upcomingFollowUpVisits}
          subtitle="Prescribed next visits"
          icon={ClipboardList}
          gradientFrom="from-amber-400"
          gradientTo="to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-150 py-4 px-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Calendar className="w-5 h-5 text-cyan-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Next Appointment
              </h2>
            </div>
            <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold">
              {summary.upcomingAppointments || 0} Upcoming
            </span>
          </div>

          {nextAppointment ? (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-5 border-2 border-cyan-400">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        Dr. {nextAppointment.doctorName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {nextAppointment.doctorSpecialization || "Dentist"}
                      </p>
                    </div>
                    <Link to="my-appointments">
                      <button className="w-full py-1.5 rounded-md px-2 bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 shadow-md transition-all">
                        View Details
                      </button>
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full">
                      <Calendar className="w-4 h-4 text-cyan-600" />
                      <span className="font-medium text-gray-700">
                        <FormattedDate date={nextAppointment.appointmentDate} />
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4 text-cyan-600" />
                      <span className="font-medium text-gray-700">
                        <FormattedTime
                          timeString={nextAppointment.appointmentTime}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium mb-4">
                No upcoming appointments
              </p>
              <Link to="/appointment">
                <PrimaryButton>Book New Appointment</PrimaryButton>
              </Link>
            </div>
          )}
        </div>

        {/* recent visits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-150 py-4 px-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Recent Visits</h2>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              {summary.completedVisits || 0} Completed
            </span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
            {recentVisits.length > 0 ? (
              recentVisits.map((visit) => (
                <div
                  key={visit._id}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-bold text-gray-900">
                          Dr. {visit.doctorName}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {visit.doctorSpecialization || "Dentist"}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1.5 flex justify-start items-center bg-green-600 text-white rounded-md text-xs font-semibold">
                      <CheckCheck className="w-4 h-4 mr-1" /> Completed
                    </span>
                  </div>
                  <div className="flex items-center justify-start gap-2 text-sm">
                    <div className="flex items-center gap-1 text-gray-700">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span>
                        <FormattedDate date={visit.appointmentDate} />
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded ${
                        visit.payment?.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}>
                      <CheckCircle className="w-3 h-3" />
                      <span className="font-semibold text-xs">
                        {visit.payment?.paymentStatus === "paid"
                          ? "Paid"
                          : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">
                  No completed visits yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-cyan-50 rounded-xl shadow-sm border border-cyan-200 p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
        </div>

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
