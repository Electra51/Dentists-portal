import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/auth/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["User"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "register",
        method: "POST",
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (loginData) => ({
        url: "login",
        method: "POST",
        body: loginData,
      }),
    }),

    getUserProfile: builder.query({
      query: () => "/profile",
      providesTags: ["User"],
    }),

    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: "/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getPendingDoctors: builder.query({
      query: () => "/pending-doctors",
      providesTags: ["PendingDoctors"],
    }),
    uploadUserImage: builder.mutation({
      query: ({ email, formData }) => ({
        url: `/profile/upload/${email}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    // Verification request endpoint
    requestVerification: builder.mutation({
      query: () => ({
        url: "/request-verification",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    // Approve doctor
    approveDoctor: builder.mutation({
      query: (doctorId) => ({
        url: `approve-doctor/${doctorId}`,
        method: "POST",
      }),
      invalidatesTags: ["PendingDoctors", "Doctors", "DashboardStats"],
    }),

    // Get verification status
    getVerificationStatus: builder.query({
      query: () => "/verification-status",
      providesTags: ["User"],
    }),

    // Reject doctor
    rejectDoctor: builder.mutation({
      query: ({ doctorId, reason }) => ({
        url: `/reject-doctor/${doctorId}`,
        method: "PUT",
        body: { reason },
      }),
      invalidatesTags: ["PendingDoctors", "Doctors", "DashboardStats"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadUserImageMutation,
  useRequestVerificationMutation,
  useGetVerificationStatusQuery,
  useApproveDoctorMutation,
  useRejectDoctorMutation,
  useGetPendingDoctorsQuery,
} = authApi;
