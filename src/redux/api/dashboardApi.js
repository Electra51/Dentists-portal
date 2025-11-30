import { baseApi } from "./baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatientDashboard: builder.query({
      query: () => "/dashboard/patient",
      providesTags: ["Dashboard"],
    }),
    getDoctorDashboard: builder.query({
      query: () => "/dashboard/doctor",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetPatientDashboardQuery, useGetDoctorDashboardQuery } =
  dashboardApi;
