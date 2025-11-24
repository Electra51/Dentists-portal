// redux/api/doctorApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const doctorApi = createApi({
  reducerPath: "doctorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/doctor",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Dashboard",
    "Appointments",
    "Patients",
    "Prescriptions",
    "Schedule",
    "Reviews",
    "Payments",
    "Profile",
    "Settings",
  ],

  endpoints: (builder) => ({
    // ==================== DASHBOARD ====================
    getDoctorDashboard: builder.query({
      query: () => "/dashboard",
      providesTags: ["Dashboard"],
    }),

    // ==================== APPOINTMENTS ====================
    getDoctorAppointments: builder.query({
      query: ({ date, status, search } = {}) => {
        const params = new URLSearchParams();
        if (date) params.append("date", date);
        if (status) params.append("status", status);
        if (search) params.append("search", search);
        return `/appointments?${params.toString()}`;
      },
      providesTags: ["Appointments"],
    }),

    getAppointmentDetails: builder.query({
      query: (appointmentId) => `/appointment/${appointmentId}`,
      providesTags: ["Appointments"],
    }),

    updateAppointmentStatus: builder.mutation({
      query: ({ appointmentId, status }) => ({
        url: `/appointment/${appointmentId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Appointments", "Dashboard"],
    }),

    // ==================== PATIENTS ====================
    getDoctorPatients: builder.query({
      query: ({ search = "", bloodGroup = "all" } = {}) =>
        `/patients?search=${search}&bloodGroup=${bloodGroup}`,
      providesTags: ["Patients"],
    }),

    getPatientDetailsByDoctor: builder.query({
      query: (patientId) => `/patient/${patientId}`,
      providesTags: ["Patients"],
    }),

    // ==================== PRESCRIPTIONS ====================
    getDoctorPrescriptions: builder.query({
      query: ({ search = "", startDate = "", endDate = "" } = {}) =>
        `/prescriptions?search=${search}&startDate=${startDate}&endDate=${endDate}`,
      providesTags: ["Prescriptions"],
    }),

    createPrescription: builder.mutation({
      query: (prescriptionData) => ({
        url: "/prescription",
        method: "POST",
        body: prescriptionData,
      }),
      invalidatesTags: ["Prescriptions", "Appointments"],
    }),

    // ==================== SCHEDULE ====================
    getDoctorSchedule: builder.query({
      query: () => "/schedule",
      providesTags: ["Schedule"],
    }),

    updateDoctorSchedule: builder.mutation({
      query: (schedule) => ({
        url: "/schedule",
        method: "PUT",
        body: { schedule },
      }),
      invalidatesTags: ["Schedule", "Profile"],
    }),

    // ==================== REVIEWS ====================
    getDoctorReviews: builder.query({
      query: (rating = "all") => `/reviews?rating=${rating}`,
      providesTags: ["Reviews"],
    }),

    // ==================== PAYMENTS ====================
    getDoctorPayments: builder.query({
      query: ({ status = "all", startDate = "", endDate = "" } = {}) =>
        `/payments?status=${status}&startDate=${startDate}&endDate=${endDate}`,
      providesTags: ["Payments"],
    }),

    // ==================== PROFILE ====================
    getDoctorProfile: builder.query({
      query: () => "/profile",
      providesTags: ["Profile"],
    }),

    updateDoctorProfile: builder.mutation({
      query: (profileData) => ({
        url: "/profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["Profile", "Dashboard"],
    }),

    // ==================== SETTINGS ====================
    getDoctorSettings: builder.query({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),

    updateDoctorSettings: builder.mutation({
      query: (settingsData) => ({
        url: "/settings",
        method: "PUT",
        body: settingsData,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetDoctorDashboardQuery,
  useGetDoctorAppointmentsQuery,
  useGetAppointmentDetailsQuery,
  useUpdateAppointmentStatusMutation,
  useGetDoctorPatientsQuery,
  useGetPatientDetailsByDoctorQuery,
  useGetDoctorPrescriptionsQuery,
  useCreatePrescriptionMutation,
  useGetDoctorScheduleQuery,
  useUpdateDoctorScheduleMutation,
  useGetDoctorReviewsQuery,
  useGetDoctorPaymentsQuery,
  useGetDoctorProfileQuery,
  useUpdateDoctorProfileMutation,
  useGetDoctorSettingsQuery,
  useUpdateDoctorSettingsMutation,
} = doctorApi;
