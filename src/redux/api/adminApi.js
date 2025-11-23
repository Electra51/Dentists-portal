import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/admin",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["PendingDoctors", "Doctors", "Patients", "DashboardStats"],

  endpoints: (builder) => ({
    // Doctor endpoints
    getPendingDoctors: builder.query({
      query: () => "/pending-doctors",
      providesTags: ["PendingDoctors"],
    }),
    getAllDoctors: builder.query({
      query: (status = "all") => `/doctors?status=${status}`,
      providesTags: ["Doctors"],
    }),
    approveDoctor: builder.mutation({
      query: (doctorId) => ({
        url: `/approve-doctor/${doctorId}`,
        method: "PUT",
      }),
      invalidatesTags: ["PendingDoctors", "Doctors", "DashboardStats"],
    }),
    rejectDoctor: builder.mutation({
      query: ({ doctorId, reason }) => ({
        url: `/reject-doctor/${doctorId}`,
        method: "PUT",
        body: { reason },
      }),
      invalidatesTags: ["PendingDoctors", "Doctors", "DashboardStats"],
    }),

    getAllPatients: builder.query({
      query: ({ search = "", bloodGroup = "all", sortBy = "createdAt" } = {}) =>
        `/patients?search=${search}&bloodGroup=${bloodGroup}&sortBy=${sortBy}`,
      providesTags: ["Patients"],
    }),
    getPatientDetails: builder.query({
      query: (patientId) => `/patient/${patientId}`,
      providesTags: ["Patients"],
    }),
    deletePatient: builder.mutation({
      query: (patientId) => ({
        url: `/patient/${patientId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Patients", "DashboardStats"],
    }),
    getPatientStats: builder.query({
      query: () => "/patient-stats",
      providesTags: ["Patients"],
    }),

    getDashboardStats: builder.query({
      query: () => "/dashboard-stats",
      providesTags: ["DashboardStats"],
    }),
  }),
});

export const {
  useGetPendingDoctorsQuery,
  useGetAllDoctorsQuery,
  useApproveDoctorMutation,
  useRejectDoctorMutation,

  useGetAllPatientsQuery,
  useGetPatientDetailsQuery,
  useDeletePatientMutation,
  useGetPatientStatsQuery,

  useGetDashboardStatsQuery,
} = adminApi;
