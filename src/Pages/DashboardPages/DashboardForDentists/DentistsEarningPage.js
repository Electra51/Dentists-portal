import React, { useState } from "react";

import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Download,
} from "lucide-react";
import {
  useGetDoctorEarningsDashboardQuery,
  useGetDoctorEarningsHistoryQuery,
  useGetDoctorMonthlyTrendQuery,
  useGetPendingPaymentsQuery,
} from "../../../redux/api/revenueEarningApi";
import { useMarkPaymentReceivedMutation } from "../../../redux/api/appointmentApi";

const DentistsEarningPage = () => {
  const [historyPage, setHistoryPage] = useState(1);
  const [historyStatus, setHistoryStatus] = useState("paid");

  // API Queries
  const { data: dashboard, isLoading: dashboardLoading } =
    useGetDoctorEarningsDashboardQuery();
  const { data: history, isLoading: historyLoading } =
    useGetDoctorEarningsHistoryQuery({
      page: historyPage,
      limit: 20,
      status: historyStatus,
    });
  const { data: monthlyTrend, isLoading: trendLoading } =
    useGetDoctorMonthlyTrendQuery();
  const { data: pendingPayments, isLoading: pendingLoading } =
    useGetPendingPaymentsQuery();

  const [markPaymentReceived, { isLoading: markingPayment }] =
    useMarkPaymentReceivedMutation();

  const handleMarkAsPaid = async (appointmentId, amount) => {
    try {
      await markPaymentReceived({
        appointmentId,
        amount,
        note: "Payment received",
      }).unwrap();
      alert("Payment marked as received successfully!");
    } catch (error) {
      alert("Failed to mark payment as received");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Earnings</h1>
          <p className="text-gray-600">Track your income and payment history</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Total Earnings
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(dashboard?.totalEarnings)}
            </p>
            <p className="text-sm text-gray-500 mt-2">All time</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              This Month
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(dashboard?.monthlyEarnings)}
            </p>
            <p className="text-sm text-green-600 mt-2">
              +{dashboard?.monthlyGrowth || 0}% from last month
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Pending Payments
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(dashboard?.pendingAmount)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {dashboard?.pendingCount || 0} appointments
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              Completed
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {dashboard?.completedAppointments || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">This month</p>
          </div>
        </div>

        {!trendLoading && monthlyTrend?.data?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Monthly Earnings Trend
            </h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {monthlyTrend.data.map((item, index) => {
                const maxAmount = Math.max(
                  ...monthlyTrend.data.map((d) => d.amount)
                );
                const height = (item.amount / maxAmount) * 100;
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                      style={{ height: `${height}%`, minHeight: "20px" }}
                      title={`${item.month}: ${formatCurrency(
                        item.amount
                      )}`}></div>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      {item.month}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!pendingLoading && pendingPayments?.data?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Pending Payments
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Patient
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Service
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.data.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatDate(payment.date)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {payment.patientName}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {payment.service}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() =>
                            handleMarkAsPaid(
                              payment.appointmentId,
                              payment.amount
                            )
                          }
                          disabled={markingPayment}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                          Mark as Paid
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Earnings History
            </h2>
            <div className="flex items-center gap-4">
              <select
                value={historyStatus}
                onChange={(e) => {
                  setHistoryStatus(e.target.value);
                  setHistoryPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="all">All</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {historyLoading ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Patient
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Service
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history?.data?.earnings.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {formatDate(item.appointmentDate)}
                        </td>

                        <td className="py-3 px-4 text-sm text-gray-900">
                          {item.patientInfo?.name}
                        </td>

                        <td className="py-3 px-4 text-sm text-gray-600">
                          {item.service}
                        </td>

                        <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                          {formatCurrency(item.payment?.paidAmount)}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              item.payment?.paymentStatus === "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                            {item.payment?.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {history?.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600">
                    Showing page {historyPage} of {history.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                      disabled={historyPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setHistoryPage((p) =>
                          Math.min(history.totalPages, p + 1)
                        )
                      }
                      disabled={historyPage === history.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DentistsEarningPage;
