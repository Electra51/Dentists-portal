// redux/api/doctorApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const prescriptionApi = createApi({
  reducerPath: "prescriptionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/prescription",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Prescription"],

  endpoints: (builder) => ({
    // ✅ Create Prescription
    createPrescription: builder.mutation({
      query: (prescriptionData) => ({
        url: "/create-prescriptions",
        method: "POST",
        body: prescriptionData,
      }),
      invalidatesTags: ["Prescription"],
    }),

    // ✅ Get Doctor's Prescriptions
    getDoctorPrescriptions: builder.query({
      query: () => "/prescriptions/doctor",
      providesTags: ["Prescription"],
    }),

    // ✅ Get Patient's Prescriptions
    getPatientPrescriptions: builder.query({
      query: (patientId) => `/prescriptions/patient/${patientId}`,
      providesTags: ["Prescription"],
    }),

    // ✅ Get Single Prescription
    getPrescriptionById: builder.query({
      query: (prescriptionId) => `/prescriptions/${prescriptionId}`,
      providesTags: (result, error, id) => [{ type: "Prescription", id }],
    }),

    // ✅ Get Prescriptions by Appointment
    getPrescriptionsByAppointment: builder.query({
      query: (appointmentId) => `/prescriptions/appointment/${appointmentId}`,
      providesTags: ["Prescription"],
    }),

    // ✅ Update Prescription
    updatePrescription: builder.mutation({
      query: ({ prescriptionId, ...data }) => ({
        url: `/prescriptions/${prescriptionId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Prescription"],
    }),

    // ✅ Delete Prescription
    deletePrescription: builder.mutation({
      query: (prescriptionId) => ({
        url: `/prescriptions/${prescriptionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Prescription"],
    }),

    // ✅ Get Prescription Statistics
    getPrescriptionStats: builder.query({
      query: () => "/prescriptions/stats",
      providesTags: ["Prescription"],
    }),
  }),
});

export const {
  useCreatePrescriptionMutation,
  useGetDoctorPrescriptionsQuery,
  useGetPatientPrescriptionsQuery,
  useGetPrescriptionByIdQuery,
  useGetPrescriptionsByAppointmentQuery,
  useUpdatePrescriptionMutation,
  useDeletePrescriptionMutation,
  useGetPrescriptionStatsQuery,
} = prescriptionApi;
