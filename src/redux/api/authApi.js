import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    loginUser: builder.mutation({
      query: (loginData) => ({
        url: "/auth/login",
        method: "POST",
        body: loginData,
      }),
    }),

    getUserProfile: builder.query({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),

    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getPendingDoctors: builder.query({
      query: () => "/auth/pending-doctors",
      providesTags: ["PendingDoctors"],
    }),

    uploadUserImage: builder.mutation({
      query: ({ email, formData }) => ({
        url: `/auth/profile/upload/${email}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    requestVerification: builder.mutation({
      query: () => ({
        url: "/auth/request-verification",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    approveDoctor: builder.mutation({
      query: (doctorId) => ({
        url: `/auth/approve-doctor/${doctorId}`,
        method: "POST",
      }),
      invalidatesTags: ["PendingDoctors", "Doctors", "DashboardStats"],
    }),

    rejectDoctor: builder.mutation({
      query: ({ doctorId, reason }) => ({
        url: `/auth/reject-doctor/${doctorId}`,
        method: "PUT",
        body: { reason },
      }),
      invalidatesTags: ["PendingDoctors", "Doctors", "DashboardStats"],
    }),

    getDoctorPatients: builder.query({
      query: ({ search = "", bloodGroup = "all" } = {}) =>
        `/doctor/patients?search=${search}&bloodGroup=${bloodGroup}`,
      providesTags: ["Patients"],
    }),

    getPatientDetailsByDoctor: builder.query({
      query: (patientId) => `/doctor/patient/${patientId}`,
      providesTags: ["Patients"],
    }),

    getDoctorSchedule: builder.query({
      query: () => "/doctor/schedule",
      providesTags: ["Schedule"],
    }),

    updateDoctorSchedule: builder.mutation({
      query: (schedule) => ({
        url: "/doctor/schedule",
        method: "PUT",
        body: { schedule },
      }),
      invalidatesTags: ["Schedule", "Profile"],
    }),

    getDoctorSettings: builder.query({
      query: () => "/doctor/settings",
      providesTags: ["Settings"],
    }),

    updateDoctorSettings: builder.mutation({
      query: (settingsData) => ({
        url: "/doctor/settings",
        method: "PUT",
        body: settingsData,
      }),
      invalidatesTags: ["Settings"],
    }),

    getAllDentists: builder.query({
      query: ({
        search = "",
        specialization = "all",
        department = "all",
        sortBy = "rating",
      } = {}) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (specialization !== "all")
          params.append("specialization", specialization);
        if (department !== "all") params.append("department", department);
        if (sortBy) params.append("sortBy", sortBy);
        return `/doctor/public/all`;
      },
      providesTags: ["PublicDentists"],
    }),

    getDentistDetails: builder.query({
      query: (dentistId) => `/doctor/public/${dentistId}`,
      providesTags: ["PublicDentists"],
    }),

    getApproveDoctors: builder.query({
      query: (status) => `/admin/doctors?status=${status}`,
      providesTags: ["Doctors"],
    }),

    getAllDoctors: builder.query({
      query: (status = "all") => `/admin/doctors?status=${status}`,
      providesTags: ["Doctors"],
    }),

    getAllPatients: builder.query({
      query: ({ search = "", bloodGroup = "all", sortBy = "createdAt" } = {}) =>
        `/admin/patients?search=${search}&bloodGroup=${bloodGroup}&sortBy=${sortBy}`,
      providesTags: ["Patients"],
    }),

    getPatientDetails: builder.query({
      query: (patientId) => `/admin/patient/${patientId}`,
      providesTags: ["Patients"],
    }),

    deletePatient: builder.mutation({
      query: (patientId) => ({
        url: `/admin/patient/${patientId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Patients", "DashboardStats"],
    }),
  }),
});

export const {
  useGetAllPatientsQuery,
  useGetApproveDoctorsQuery,
  useGetPatientDetailsQuery,
  useDeletePatientMutation,
  useGetAllDoctorsQuery,
  useGetAllDentistsQuery,
  useGetDentistDetailsQuery,
  useGetDoctorSettingsQuery,
  useUpdateDoctorSettingsMutation,
  useGetDoctorScheduleQuery,
  useUpdateDoctorScheduleMutation,
  useGetPatientDetailsByDoctorQuery,
  useGetDoctorPatientsQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadUserImageMutation,
  useRequestVerificationMutation,
  useApproveDoctorMutation,
  useRejectDoctorMutation,
  useGetPendingDoctorsQuery,
} = authApi;
