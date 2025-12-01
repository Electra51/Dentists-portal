import React, { useState } from "react";
import {
  useGetAdminRevenueDashboardQuery,
  useGetRevenueByDoctorQuery,
  useGetRevenueByServiceQuery,
  useGetMonthlyRevenueTrendQuery,
  useGetRecentTransactionsQuery,
} from "../../../redux/api/revenueEarningApi";
import {
  FiFileText,
  FiTrendingUp,
  FiUsers,
  FiActivity,
  FiDownload,
  FiCalendar,
  FiDollarSign,
  FiBarChart2,
  FiPieChart,
} from "react-icons/fi";

const AdminReportsMenu = () => {
  const [dateRange, setDateRange] = useState("all");
  const [selectedReport, setSelectedReport] = useState("overview");

  // ✅ Fetch data using existing APIs
  const { data: revenue, isLoading: loadingRevenue } =
    useGetAdminRevenueDashboardQuery();
  const { data: doctorStats, isLoading: loadingDoctors } =
    useGetRevenueByDoctorQuery();
  const { data: serviceStats, isLoading: loadingServices } =
    useGetRevenueByServiceQuery();
  const { data: monthlyTrend, isLoading: loadingTrend } =
    useGetMonthlyRevenueTrendQuery();
  const { data: transactions } = useGetRecentTransactionsQuery({
    page: 1,
    limit: 100,
    status: "all",
  });

  const overview = revenue?.data?.overview || {};
  const doctors = doctorStats?.data || [];
  const services = serviceStats?.data || [];
  const trend = monthlyTrend?.data || [];
  const allTransactions = transactions?.data?.transactions || [];

  // ✅ Calculate additional statistics
  const totalAppointments =
    overview.totalPaidAppointments + overview.pendingCount || 0;
  const completionRate = totalAppointments
    ? ((overview.totalPaidAppointments / totalAppointments) * 100).toFixed(1)
    : 0;
  const averageRevenuePerAppointment = overview.totalPaidAppointments
    ? (overview.totalRevenue / overview.totalPaidAppointments).toFixed(0)
    : 0;

  // ✅ Calculate payment method breakdown
  const paymentMethodBreakdown = allTransactions.reduce((acc, t) => {
    const method = t.payment?.paymentMethod || "cash";
    if (!acc[method]) acc[method] = { count: 0, total: 0 };
    acc[method].count++;
    acc[method].total += t.payment?.paidAmount || 0;
    return acc;
  }, {});

  // ✅ Export to CSV function
  const exportToCSV = (data, filename) => {
    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // ✅ Export handlers
  const handleExportFinancial = () => {
    const data = [
      {
        Metric: "Total Revenue",
        Value: overview.totalRevenue,
        Count: overview.totalPaidAppointments,
      },
      {
        Metric: "Monthly Revenue",
        Value: overview.monthRevenue,
        Count: overview.monthPaidCount,
      },
      {
        Metric: "Today Revenue",
        Value: overview.todayRevenue,
        Count: overview.todayPaidCount,
      },
      {
        Metric: "Pending",
        Value: overview.pendingAmount,
        Count: overview.pendingCount,
      },
    ];
    exportToCSV(data, "financial_report");
  };

  const handleExportDoctors = () => {
    const data = doctors.map((d) => ({
      Doctor: d.doctorName,
      Specialization: d.doctorSpecialization || "Dentist",
      Revenue: d.totalRevenue,
      Appointments: d.totalAppointments,
    }));
    exportToCSV(data, "doctor_performance_report");
  };

  const handleExportServices = () => {
    const data = services.map((s) => ({
      Service: s._id,
      Revenue: s.totalRevenue,
      Appointments: s.totalAppointments,
      AverageFee: Math.round(s.averageFee),
    }));
    exportToCSV(data, "service_report");
  };

  if (loadingRevenue) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1440px] mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FiFileText className="text-blue-600" />
          Reports & Analytics
        </h1>
        <p className="text-gray-600 mt-1">
          Comprehensive clinic performance reports and insights
        </p>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => setSelectedReport("overview")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedReport === "overview"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            <FiBarChart2 className="inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setSelectedReport("financial")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedReport === "financial"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            <FiDollarSign className="inline mr-2" />
            Financial
          </button>
          <button
            onClick={() => setSelectedReport("appointments")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedReport === "appointments"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            <FiCalendar className="inline mr-2" />
            Appointments
          </button>
          <button
            onClick={() => setSelectedReport("performance")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedReport === "performance"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}>
            <FiUsers className="inline mr-2" />
            Performance
          </button>
        </div>
      </div>

      {/* Overview Report */}
      {selectedReport === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={<FiDollarSign className="text-green-600" />}
              title="Total Revenue"
              value={`৳ ${overview.totalRevenue?.toLocaleString() || 0}`}
              subtitle={`${
                overview.totalPaidAppointments || 0
              } paid appointments`}
              bgColor="bg-green-50"
            />
            <MetricCard
              icon={<FiActivity className="text-blue-600" />}
              title="Completion Rate"
              value={`${completionRate}%`}
              subtitle={`${totalAppointments} total appointments`}
              bgColor="bg-blue-50"
            />
            <MetricCard
              icon={<FiTrendingUp className="text-purple-600" />}
              title="Avg Revenue/Appointment"
              value={`৳ ${averageRevenuePerAppointment}`}
              subtitle="Per appointment average"
              bgColor="bg-purple-50"
            />
            <MetricCard
              icon={<FiUsers className="text-orange-600" />}
              title="Active Doctors"
              value={doctors.length}
              subtitle="Contributing to revenue"
              bgColor="bg-orange-50"
            />
          </div>

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiTrendingUp className="text-blue-600" />
                Monthly Performance Summary
              </h3>
              <div className="space-y-3">
                {trend.slice(-3).map((month, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">
                        {month.monthName} {month.year}
                      </p>
                      <p className="text-sm text-gray-500">
                        {month.totalAppointments} appointments
                      </p>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      ৳ {month.totalRevenue?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiPieChart className="text-purple-600" />
                Payment Method Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(paymentMethodBreakdown).map(
                  ([method, data]) => (
                    <div
                      key={method}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 capitalize">
                          {method}
                        </p>
                        <p className="text-sm text-gray-500">
                          {data.count} transactions
                        </p>
                      </div>
                      <p className="text-lg font-bold text-blue-600">
                        ৳ {data.total.toLocaleString()}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Report */}
      {selectedReport === "financial" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Financial Report
            </h2>
            <button
              onClick={handleExportFinancial}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <FiDownload />
              Export Financial Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon={<FiDollarSign className="text-green-600" />}
              title="Total Revenue"
              value={`৳ ${overview.totalRevenue?.toLocaleString()}`}
              subtitle="All time"
              bgColor="bg-green-50"
            />
            <MetricCard
              icon={<FiTrendingUp className="text-blue-600" />}
              title="This Month"
              value={`৳ ${overview.monthRevenue?.toLocaleString()}`}
              subtitle={`${overview.monthPaidCount} payments`}
              bgColor="bg-blue-50"
            />
            <MetricCard
              icon={<FiActivity className="text-purple-600" />}
              title="Today"
              value={`৳ ${overview.todayRevenue?.toLocaleString()}`}
              subtitle={`${overview.todayPaidCount} payments`}
              bgColor="bg-purple-50"
            />
            <MetricCard
              icon={<FiCalendar className="text-orange-600" />}
              title="Pending"
              value={`৳ ${overview.pendingAmount?.toLocaleString()}`}
              subtitle={`${overview.pendingCount} pending`}
              bgColor="bg-orange-50"
            />
          </div>

          {/* Revenue Trend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Revenue Trend (Last 6 Months)
            </h3>
            {loadingTrend ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {trend.map((month, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {month.monthName} {month.year}
                      </p>
                      <p className="text-sm text-gray-500">
                        {month.totalAppointments} appointments
                      </p>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (month.totalRevenue /
                                Math.max(...trend.map((t) => t.totalRevenue))) *
                              100
                            }%`,
                          }}></div>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      ৳ {month.totalRevenue?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Appointments Report */}
      {selectedReport === "appointments" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Appointment Analytics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              icon={<FiCalendar className="text-blue-600" />}
              title="Total Appointments"
              value={totalAppointments}
              subtitle="All appointments"
              bgColor="bg-blue-50"
            />
            <MetricCard
              icon={<FiActivity className="text-green-600" />}
              title="Completed"
              value={overview.totalPaidAppointments}
              subtitle={`${completionRate}% completion rate`}
              bgColor="bg-green-50"
            />
            <MetricCard
              icon={<FiCalendar className="text-orange-600" />}
              title="Pending"
              value={overview.pendingCount}
              subtitle="Awaiting completion"
              bgColor="bg-orange-50"
            />
          </div>

          {/* Service-wise Appointments */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Appointments by Service
              </h3>
              <button
                onClick={handleExportServices}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                <FiDownload />
                Export
              </button>
            </div>
            {loadingServices ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                    <p className="font-semibold text-gray-800 mb-2">
                      {service._id || "General Consultation"}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {service.totalAppointments}
                        </p>
                        <p className="text-xs text-gray-500">appointments</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          ৳ {service.totalRevenue?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Avg: ৳ {Math.round(service.averageFee)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Performance Report */}
      {selectedReport === "performance" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Doctor Performance Report
            </h2>
            <button
              onClick={handleExportDoctors}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <FiDownload />
              Export Performance Report
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Doctor Rankings
            </h3>
            {loadingDoctors ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {doctors.map((doctor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                            ? "bg-gray-400"
                            : index === 2
                            ? "bg-orange-600"
                            : "bg-blue-500"
                        }`}>
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-lg">
                          {doctor.doctorName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {doctor.doctorSpecialization || "Prosthodontics"}
                        </p>
                      </div>
                    </div>
                    <div className="text-center mx-8">
                      <p className="text-2xl font-bold text-blue-600">
                        {doctor.totalAppointments}
                      </p>
                      <p className="text-xs text-gray-500">patients</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ৳ {doctor.totalRevenue?.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">total revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Metric Card Component
const MetricCard = ({ icon, title, value, subtitle, bgColor }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-full ${bgColor}`}>{icon}</div>
    </div>
    <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-800 mb-1">{value}</p>
    <p className="text-xs text-gray-500">{subtitle}</p>
  </div>
);

export default AdminReportsMenu;
