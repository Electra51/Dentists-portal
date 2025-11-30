import { baseApi } from "./baseApi";

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableSlots: builder.query({
      query: ({ doctorId, date }) =>
        `/appointments/available-slots?doctorId=${doctorId}&date=${date}`,
    }),

    createAppointment: builder.mutation({
      query: (appointmentData) => ({
        url: "/appointments/create",
        method: "POST",
        body: appointmentData,
      }),
      invalidatesTags: ["Appointments"],
    }),

    getPatientAppointments: builder.query({
      query: (status) =>
        status
          ? `/appointments/patient?status=${status}`
          : "/appointments/patient",
      providesTags: ["Appointments"],
    }),

    getArchivedAppointments: builder.query({
      query: () => "/appointments/doctor/archived",
      providesTags: ["Appointments"],
    }),

    getDoctorAppointments: builder.query({
      query: ({ date, status, search } = {}) => {
        const params = new URLSearchParams();
        if (date) params.append("date", date);
        if (status) params.append("status", status);
        if (search) params.append("search", search);
        return `/appointments/doctor`;
      },
      providesTags: ["Appointments"],
    }),

    getAppointmentDetails: builder.query({
      query: (appointmentId) => `/appointments/${appointmentId}`,
      providesTags: ["Appointments"],
    }),
    deleteAppointment: builder.mutation({
      query: (appointmentId) => ({
        url: `/appointments/appointments/${appointmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Appointments"],
    }),
    updateAppointmentStatus: builder.mutation({
      query: ({ appointmentId, status }) => ({
        url: `/appointments/${appointmentId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Appointments", "Dashboard"],
    }),

    markPaymentReceived: builder.mutation({
      query: ({ appointmentId, amount, note }) => ({
        url: `/appointments/${appointmentId}/mark-paid`,
        method: "PATCH",
        body: { amount, note },
      }),
      invalidatesTags: ["Appointments"],
    }),

    confirmAppointment: builder.mutation({
      query: (appointmentId) => ({
        url: `/appointments/${appointmentId}/confirm`,
        method: "PATCH",
      }),
      invalidatesTags: ["Appointments"],
    }),

    completeAppointment: builder.mutation({
      query: ({ appointmentId, ...data }) => ({
        url: `/appointments/${appointmentId}/complete`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Appointments"],
    }),

    markAsNoShow: builder.mutation({
      query: ({ appointmentId, reason }) => ({
        url: `/appointments/${appointmentId}/no-show`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Appointments"],
    }),

    cancelAppointment: builder.mutation({
      query: ({ appointmentId, reason }) => ({
        url: `/appointments/${appointmentId}/cancel`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Appointments"],
    }),

    archiveExpiredAppointments: builder.mutation({
      query: () => ({
        url: "/appointments/archive-expired",
        method: "POST",
      }),
      invalidatesTags: ["Appointments"],
    }),

    getAllAppointments: builder.query({
      query: ({
        status = "all",
        date = "",
        startDate = "",
        endDate = "",
        doctorId = "all",
        patientId = "all",
      } = {}) => {
        const params = new URLSearchParams();
        if (status !== "all") params.append("status", status);
        if (date) params.append("date", date);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (doctorId !== "all") params.append("doctorId", doctorId);
        if (patientId !== "all") params.append("patientId", patientId);
        return `/appointments/admin-appointments`;
      },
      providesTags: ["Appointment"],
    }),

    deleteArchivedAppointment: builder.mutation({
      query: (appointmentId) => ({
        url: `/admin/appointment/${appointmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Appointment", "Dashboard"],
    }),
  }),
});

export const {
  useGetAllAppointmentsQuery,
  useDeleteArchivedAppointmentMutation,
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
  useUpdateAppointmentStatusMutation,
} = appointmentApi;
