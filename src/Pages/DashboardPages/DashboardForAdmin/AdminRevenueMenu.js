import React, { useState } from "react";
import {
  useGetAdminRevenueDashboardQuery,
  useGetRevenueByDoctorQuery,
  useGetRevenueByServiceQuery,
  useGetMonthlyRevenueTrendQuery,
  useGetRecentTransactionsQuery,
} from "../../../redux/api/revenueEarningApi";
import {
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiUser,
  FiActivity,
} from "react-icons/fi";

const AdminRevenueMenu = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: dashboard, isLoading: loadingDashboard } =
    useGetAdminRevenueDashboardQuery();
  const { data: topDoctors, isLoading: loadingDoctors } =
    useGetRevenueByDoctorQuery();
  const { data: serviceRevenue, isLoading: loadingServices } =
    useGetRevenueByServiceQuery();
  const { data: monthlyTrend, isLoading: loadingTrend } =
    useGetMonthlyRevenueTrendQuery();
  const { data: transactions, isLoading: loadingTransactions } =
    useGetRecentTransactionsQuery({
      page: currentPage,
      limit: 10,
      status: statusFilter,
    });

  const overview = dashboard?.data?.overview || {};
  const doctors = topDoctors?.data || [];
  const services = serviceRevenue?.data || [];
  const trend = monthlyTrend?.data || [];
  const transactionList = transactions?.data?.transactions || [];
  const pagination = transactions?.data?.pagination || {};

  if (loadingDashboard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Revenue Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen max-w-[1440px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Revenue Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Monitor clinic financial performance and earnings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FiDollarSign className="text-green-600" />}
          title="Total Revenue"
          value={`৳ ${overview.totalRevenue?.toLocaleString() || 0}`}
          subtitle={`${overview.totalPaidAppointments || 0} paid appointments`}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<FiTrendingUp className="text-blue-600" />}
          title="This Month"
          value={`৳ ${overview.monthRevenue?.toLocaleString() || 0}`}
          subtitle={`${overview.monthPaidCount || 0} appointments`}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<FiCheckCircle className="text-purple-600" />}
          title="Today's Revenue"
          value={`৳ ${overview.todayRevenue?.toLocaleString() || 0}`}
          subtitle={`${overview.todayPaidCount || 0} payments today`}
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={<FiClock className="text-orange-600" />}
          title="Pending Payments"
          value={`৳ ${overview.pendingAmount?.toLocaleString() || 0}`}
          subtitle={`${overview.pendingCount || 0} pending`}
          bgColor="bg-orange-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiActivity className="text-blue-600" />
            Monthly Revenue Trend
          </h2>
          {loadingTrend ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {trend.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.monthName} {item.year}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.totalAppointments} appointments
                    </p>
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    ৳ {item.totalRevenue?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiUser className="text-purple-600" />
            Top Earning Doctors
          </h2>
          {loadingDoctors ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {doctors.slice(0, 6).map((doctor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-purple-600">
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {doctor.doctorName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {doctor.doctorSpecialization || "Dentist"} •{" "}
                        {doctor.totalAppointments} patients
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    ৳ {doctor.totalRevenue?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Revenue by Service
        </h2>
        {loadingServices ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <p className="font-semibold text-gray-800 mb-2">
                  {service._id || "General Consultation"}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      {service.totalAppointments} appointments
                    </p>
                    <p className="text-xs text-gray-500">
                      Avg: ৳ {Math.round(service.averageFee)}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-green-600">
                    ৳ {service.totalRevenue?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Transactions
          </h2>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {loadingTransactions ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactionList.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.bookingId}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">
                          {transaction.patientInfo?.name}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">
                          {transaction.doctorName}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">
                          {transaction.service}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">
                          {new Date(
                            transaction.appointmentDate
                          ).toLocaleDateString("en-GB")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transaction.appointmentTime}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-semibold text-gray-900">
                          ৳{" "}
                          {transaction.payment?.paidAmount ||
                            transaction.payment?.consultationFee}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transaction.payment?.paymentMethod}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.payment?.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800"
                              : transaction.payment?.paymentStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                          {transaction.payment?.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * 10 + 1} to{" "}
                  {Math.min(currentPage * 10, pagination.total)} of{" "}
                  {pagination.total} transactions
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition">
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {[...Array(pagination.totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-2 rounded-lg transition ${
                          currentPage === index + 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}>
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(pagination.totalPages, prev + 1)
                      )
                    }
                    disabled={currentPage === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition">
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle, bgColor }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-full ${bgColor}`}>{icon}</div>
    </div>
    <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-800 mb-1">{value}</p>
    <p className="text-xs text-gray-500">{subtitle}</p>
  </div>
);

export default AdminRevenueMenu;
