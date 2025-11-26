// redux/api/appointmentApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/appointments",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Appointments"],
  endpoints: (builder) => ({
    // get available slots for landing page
    getAvailableSlots: builder.query({
      query: ({ doctorId, date }) =>
        `/available-slots?doctorId=${doctorId}&date=${date}`,
    }),

    // create appointment by patients
    createAppointment: builder.mutation({
      query: (appointmentData) => ({
        url: "/create",
        method: "POST",
        body: appointmentData,
      }),
      invalidatesTags: ["Appointments"],
    }),

    // get patient appointments
    getPatientAppointments: builder.query({
      query: (status) => (status ? `/patient?status=${status}` : "/patient"),
      providesTags: ["Appointments"],
    }),

    // ==================== APPOINTMENTS ====================
    getDoctorAppointments: builder.query({
      query: ({ date, status, search } = {}) => {
        const params = new URLSearchParams();
        if (date) params.append("date", date);
        if (status) params.append("status", status);
        if (search) params.append("search", search);
        return `/doctor`;
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

    // ✅ NEW: Mark payment as received (Doctor only)
    markPaymentReceived: builder.mutation({
      query: ({ appointmentId, amount, note }) => ({
        url: `/${appointmentId}/mark-paid`,
        method: "PATCH",
        body: { amount, note },
      }),
      invalidatesTags: ["Appointments"],
    }),
  }),
});

export const {
  useGetAvailableSlotsQuery,
  useCreateAppointmentMutation,
  useGetPatientAppointmentsQuery,
  useGetDoctorAppointmentsQuery,
  useGetAppointmentDetailsQuery,
  useUpdateAppointmentStatusMutation,
  useMarkPaymentReceivedMutation,
} = appointmentApi;
