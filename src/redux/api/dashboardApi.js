// redux/api/doctorApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/dashboard",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Dashboard", "Stats"],

  endpoints: (builder) => ({
    // Get Patient Dashboard Data
    getPatientDashboard: builder.query({
      query: () => "/patient",
      providesTags: ["Dashboard"],
    }),

    // Get Appointment Statistics
    getAppointmentStats: builder.query({
      query: () => "/stats",
      providesTags: ["Stats"],
    }),

    // Optional: Refresh dashboard (for manual refresh)
    refreshDashboard: builder.mutation({
      query: () => "/patient",
      invalidatesTags: ["Dashboard", "Stats"],
    }),
  }),
});

export const {
  useGetPatientDashboardQuery,
  useGetAppointmentStatsQuery,
  useRefreshDashboardMutation,
} = dashboardApi;
