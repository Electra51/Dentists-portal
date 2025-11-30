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
    // Get archived appointments
    getArchivedAppointments: builder.query({
      query: () => "/doctor/archived",
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
      query: (appointmentId) => `/${appointmentId}`,
      providesTags: ["Appointments"],
    }),
    deleteAppointment: builder.mutation({
      query: (appointmentId) => ({
        url: `/appointments/${appointmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Appointments"],
    }),
    updateAppointmentStatus: builder.mutation({
      query: ({ appointmentId, status }) => ({
        url: `/${appointmentId}/status`,
        method: "PATCH",
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

    // Get single appointment details
    // getAppointmentDetails: builder.query({
    //   query: (appointmentId) => `/${appointmentId}`,
    //   providesTags: ["Appointments"],
    // }),

    // ✅ NEW: Confirm appointment (Doctor)
    confirmAppointment: builder.mutation({
      query: (appointmentId) => ({
        url: `/${appointmentId}/confirm`,
        method: "PATCH",
      }),
      invalidatesTags: ["Appointments"],
    }),

    // ✅ NEW: Complete appointment (Doctor)
    completeAppointment: builder.mutation({
      query: ({ appointmentId, ...data }) => ({
        url: `/${appointmentId}/complete`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Appointments"],
    }),

    // ✅ NEW: Mark as no-show (Doctor)
    markAsNoShow: builder.mutation({
      query: ({ appointmentId, reason }) => ({
        url: `/${appointmentId}/no-show`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Appointments"],
    }),

    // Mark payment received
    // markPaymentReceived: builder.mutation({
    //   query: ({ appointmentId, amount, note }) => ({
    //     url: `/${appointmentId}/mark-paid`,
    //     method: "PATCH",
    //     body: { amount, note },
    //   }),
    //   invalidatesTags: ["Appointments"],
    // }),

    // Cancel appointment (Patient)
    cancelAppointment: builder.mutation({
      query: ({ appointmentId, reason }) => ({
        url: `/${appointmentId}/cancel`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Appointments"],
    }),

    // Delete appointment
    // deleteAppointment: builder.mutation({
    //   query: (appointmentId) => ({
    //     url: `/${appointmentId}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Appointments"],
    // }),

    // Archive expired appointments (Manual trigger)
    archiveExpiredAppointments: builder.mutation({
      query: () => ({
        url: "/archive-expired",
        method: "POST",
      }),
      invalidatesTags: ["Appointments"],
    }),

    // ✅ DEPRECATED: Keep for backward compatibility
    // updateAppointmentStatus: builder.mutation({
    //   query: ({ appointmentId, status }) => ({
    //     url: `/${appointmentId}/status`,
    //     method: "PATCH",
    //     body: { status },
    //   }),
    //   invalidatesTags: ["Appointments"],
    // }),
  }),
});

export const {
  // useGetAvailableSlotsQuery,
  // useCreateAppointmentMutation,
  // useGetPatientAppointmentsQuery,
  // useGetDoctorAppointmentsQuery,
  // useGetAppointmentDetailsQuery,
  // useUpdateAppointmentStatusMutation,
  // useMarkPaymentReceivedMutation,
  // useDeleteAppointmentMutation,

  useGetAvailableSlotsQuery,
  useCreateAppointmentMutation,
  useGetPatientAppointmentsQuery,
  useGetDoctorAppointmentsQuery,
  useGetArchivedAppointmentsQuery,
  useGetAppointmentDetailsQuery,
  useConfirmAppointmentMutation,
  useCompleteAppointmentMutation,
  useMarkAsNoShowMutation,
  useMarkPaymentReceivedMutation,
  useCancelAppointmentMutation,
  useDeleteAppointmentMutation,
  useArchiveExpiredAppointmentsMutation,
  useUpdateAppointmentStatusMutation, // Deprecated
} = appointmentApi;
