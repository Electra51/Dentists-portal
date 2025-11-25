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

    // Get doctor appointments
    getDoctorAppointments: builder.query({
      query: ({ status, date }) => {
        let url = "/doctor";
        const params = [];
        if (status) params.push(`status=${status}`);
        if (date) params.push(`date=${date}`);
        if (params.length) url += `?${params.join("&")}`;
        return url;
      },
      providesTags: ["Appointments"],
    }),

    // Get appointment details
    getAppointmentDetails: builder.query({
      query: (appointmentId) => `/${appointmentId}`,
      providesTags: ["Appointments"],
    }),

    // Update appointment status
    updateAppointmentStatus: builder.mutation({
      query: ({ appointmentId, ...data }) => ({
        url: `/${appointmentId}/status`,
        method: "PATCH",
        body: data,
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
} = appointmentApi;
