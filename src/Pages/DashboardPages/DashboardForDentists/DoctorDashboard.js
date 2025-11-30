import React from "react";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  Activity,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { useGetDoctorDashboardQuery } from "../../../redux/api/dashboardApi";
import LoadingState from "../../../Components/states/LoadingState";
import MessageState from "../../../Components/states/MessageState";
import FormattedTime from "../../../Components/DateTimeFormate/FormattedTime";
import FormattedDate from "../../../Components/DateTimeFormate/FormattedDate";
import DashboardHeader from "../../../Components/DashboardHeader";
import StatsCard from "../../../Components/StatsCard";

const DoctorDashboard = () => {
  const { data, isLoading, isError } = useGetDoctorDashboardQuery();

  if (isLoading) {
    return (
      <LoadingState
        message="Loading dashboard..."
        spinnerColor="border-[#5ecdc9]"
        height={"min-h-screen"}
      />
    );
  }

  if (isError) {
    return (
      <MessageState
        type="error"
        title=" Unable to Load Dashboard"
        message="Please try refreshing the page or contact support if the problem persists."
      />
    );
  }

  const { summary, todayAppointments, upcomingFollowUps, recentPatients } =
    data?.data || {};

  const statsCards = [
    {
      title: "Today's Appointments",
      value: summary?.todayAppointments?.count || 0,
      subtitle: `${summary?.todayAppointments?.confirmed || 0} confirmed`,
      icon: Calendar,
      color: "cyan",
      bgGradient: "from-cyan-400 to-teal-500",
    },
    {
      title: "Follow-ups Scheduled",
      value: summary?.followUps?.scheduled || 0,
      subtitle: "Upcoming visits",
      icon: Clock,
      color: "purple",
      bgGradient: "from-purple-400 to-purple-600",
    },
    {
      title: "Total Revenue",
      value: summary?.revenue?.total || 0,
      subtitle: `${summary?.revenue?.paidCount || 0} paid appointments`,
      icon: DollarSign,
      color: "blue",
      bgGradient: "from-blue-400 to-blue-600",
      isCurrency: true,
    },
    {
      title: "Pending Revenue",
      value: summary?.revenue?.pending || 0,
      subtitle: `${summary?.revenue?.unpaidCount || 0} unpaid`,
      icon: TrendingUp,
      color: "orange",
      bgGradient: "from-orange-400 to-orange-600",
      isCurrency: true,
    },
  ];

  const patientStats = [
    {
      title: "Total Patients",
      value: summary?.patients?.total || 0,
      subtitle: "All time",
      icon: Users,
      color: "cyan",
    },
    {
      title: "Recent Visits",
      value: summary?.patients?.recentVisits || 0,
      subtitle: "Last 30 days",
      icon: Activity,
      color: "purple",
    },
    {
      title: "With Allergies",
      value: summary?.patients?.withAllergies || 0,
      subtitle: "Patients",
      icon: AlertCircle,
      color: "blue",
    },
    {
      title: "Chronic Cases",
      value: summary?.patients?.chronicCases || 0,
      subtitle: "Active patients",
      icon: FileText,
      color: "orange",
    },
  ];

  return (
    <div className="min-h-screen p-6 max-w-[1440px] mx-auto">
      <DashboardHeader
        icon={LayoutDashboard}
        title="Dashboard"
        subtitle="View and manage your appointments and patients"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <StatsCard
            title={stat.subtitle}
            value={stat.isCurrency ? stat.value : stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            gradientFrom={stat.bgGradient}
            // gradientTo="to-green-400"
            gradientTo={stat.bgGradient}
          />
        ))}
      </div>

      {/* Patient Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {patientStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">{stat.value}</h2>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              {stat.title}
            </h3>
            <p className="text-xs text-gray-500">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-600" />
              Today's Appointments
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {todayAppointments?.length || 0} appointments scheduled
            </p>
          </div>
          <div className="p-6">
            {todayAppointments && todayAppointments.length > 0 ? (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {appointment.patientName?.charAt(0) || "P"}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800">
                        {appointment.patientName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {appointment.service}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <FormattedTime
                            timeString={appointment.appointmentTime}
                          />
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full ${
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  No Today's Appointments
                </p>
                <p className="text-sm text-gray-400">
                  No appointments scheduled for today
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Follow-ups */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Upcoming Follow-ups
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Next prescription visits
            </p>
          </div>
          <div className="p-6">
            {upcomingFollowUps && upcomingFollowUps.length > 0 ? (
              <div className="space-y-4">
                {upcomingFollowUps.map((followUp) => (
                  <div
                    key={followUp._id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {followUp.patientName?.charAt(0) || "P"}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800">
                        {followUp.patientName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {followUp.medicinesCount} medicine(s) prescribed
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        Next Visit: <FormattedDate date={followUp.nextVisit} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No Follow-ups</p>
                <p className="text-sm text-gray-400">
                  No upcoming follow-up visits scheduled
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 lg:col-span-2">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Recent Patients
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Recently visited patients
            </p>
          </div>
          <div className="p-6">
            {recentPatients && recentPatients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentPatients.map((patient) => (
                  <div
                    key={patient._id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {patient.name?.charAt(0) || "P"}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-gray-600">{patient.email}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {patient.hasAllergies && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            Allergy Alert
                          </span>
                        )}
                        {patient.hasChronicConditions && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                            Chronic Condition
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Last Visit:
                        <FormattedDate date={patient.lastVisit} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No Recent Patients</p>
                <p className="text-sm text-gray-400">
                  No patients have visited recently
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
