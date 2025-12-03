import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:8080/api/v1",
    baseUrl: "https://dentists-portal-backend.vercel.app/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "revenueEarning",
    "Auth",
    "Dashboard",
    "Appointments",
    "Patients",
    "Doctors",
    "Prescriptions",
    "Schedule",
    "Reviews",
    "Payments",
    "Profile",
    "Settings",
    "PendingDoctors",
    "Stats",
    "Review",
    "DoctorReviews",
    "MyReviews",
  ],
  endpoints: () => ({}), // Empty - endpoints inject হবে
});
