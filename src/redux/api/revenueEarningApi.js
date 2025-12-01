import { baseApi } from "./baseApi";

export const revenueEarningApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========================
    // Admin Revenue API
    // ========================
    // ✅ Get Admin Revenue Dashboard
    getAdminRevenueDashboard: builder.query({
      query: () => "/admin/revenue/dashboard",
      providesTags: ["Revenue"],
    }),

    // ✅ Get Revenue by Doctor
    getRevenueByDoctor: builder.query({
      query: () => "/admin/revenue/by-doctor",
      providesTags: ["Revenue"],
    }),

    // ✅ Get Revenue by Service
    getRevenueByService: builder.query({
      query: () => "/admin/revenue/by-service",
      providesTags: ["Revenue"],
    }),

    // ✅ Get Monthly Revenue Trend
    getMonthlyRevenueTrend: builder.query({
      query: () => "/admin/revenue/monthly-trend",
      providesTags: ["Revenue"],
    }),

    // ✅ Get Recent Transactions with Pagination & Filter
    getRecentTransactions: builder.query({
      query: ({ page = 1, limit = 20, status = "all" }) =>
        `/admin/revenue/transactions`,
      providesTags: ["Revenue", "Transactions"],
    }),

    // for doctor
    // ✅ Get Doctor Earnings Dashboard
    getDoctorEarningsDashboard: builder.query({
      query: () => "/doctor/earnings/dashboard",
      providesTags: ["Earnings"],
    }),

    // ✅ Get Doctor Earnings History
    getDoctorEarningsHistory: builder.query({
      query: ({ page = 1, limit = 20, status = "paid" }) =>
        `/doctor/earnings/history?page=${page}&limit=${limit}&status=${status}`,
      providesTags: ["Earnings", "EarningsHistory"],
    }),

    // ✅ Get Doctor Monthly Trend
    getDoctorMonthlyTrend: builder.query({
      query: () => "/doctor/earnings/monthly-trend",
      providesTags: ["Earnings"],
    }),

    // ✅ Get Pending Payments
    getPendingPayments: builder.query({
      query: () => "/doctor/earnings/pending",
      providesTags: ["Earnings", "PendingPayments"],
    }),

    // ✅ Mark Payment as Received (Mutation)
    markPaymentReceived: builder.mutation({
      query: ({ appointmentId, amount, note }) => ({
        url: `/doctor/earnings/mark-paid/${appointmentId}`,
        method: "PATCH",
        body: { amount, note },
      }),
      invalidatesTags: [
        "Earnings",
        "PendingPayments",
        "EarningsHistory",
        "Appointments",
      ],
    }),
  }),
});

// ========================
// Doctor Earnings API
// ========================

// ========================
// Export Hooks
// ========================

// Admin Revenue Hooks
export const {
  useGetAdminRevenueDashboardQuery,
  useGetRevenueByDoctorQuery,
  useGetRevenueByServiceQuery,
  useGetMonthlyRevenueTrendQuery,
  useGetRecentTransactionsQuery,
  useGetDoctorEarningsDashboardQuery,
  useGetDoctorEarningsHistoryQuery,
  useGetDoctorMonthlyTrendQuery,
  useGetPendingPaymentsQuery,
  useMarkPaymentReceivedMutation,
} = revenueEarningApi;
