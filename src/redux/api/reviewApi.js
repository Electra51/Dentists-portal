// import { baseApi } from "./baseApi";
// export const reviewApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // Patient review submit
//     submitReview: builder.mutation({
//       query: (reviewData) => ({
//         url: "/review/submit",
//         method: "POST",
//         body: reviewData,
//       }),
//       invalidatesTags: ["MyReviews", "DoctorReviews"],
//     }),

//     // Doctor er reviews fetch
//     getDoctorReviews: builder.query({
//       query: ({ doctorId, status = "approved" }) => ({
//         url: `/review/doctor/${doctorId}?status=${status}`,
//         method: "GET",
//       }),
//       providesTags: ["DoctorReviews"],
//     }),

//     // Admin review moderate
//     moderateReview: builder.mutation({
//       query: ({ reviewId, status }) => ({
//         url: `/review/moderate/${reviewId}`,
//         method: "PUT",
//         body: { status },
//       }),
//       invalidatesTags: ["Review", "DoctorReviews"],
//     }),

//     // Patient er own reviews
//     getMyReviews: builder.query({
//       query: () => ({
//         url: "/review/my-reviews",
//         method: "GET",
//       }),
//       providesTags: ["MyReviews"],
//     }),

//     // Review update
//     updateReview: builder.mutation({
//       query: ({ reviewId, rating, comment }) => ({
//         url: `/review/update/${reviewId}`,
//         method: "PUT",
//         body: { rating, comment },
//       }),
//       invalidatesTags: ["MyReviews", "DoctorReviews"],
//     }),

//     // Review delete
//     deleteReview: builder.mutation({
//       query: (reviewId) => ({
//         url: `/review/delete/${reviewId}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["MyReviews", "DoctorReviews"],
//     }),

//     // Admin er jonno all pending reviews
//     getAllPendingReviews: builder.query({
//       query: () => ({
//         url: "/review/pending",
//         method: "GET",
//       }),
//       providesTags: ["Review"],
//     }),
//   }),
// });

// export const {
//   useSubmitReviewMutation,
//   useGetDoctorReviewsQuery,
//   useModerateReviewMutation,
//   useGetMyReviewsQuery,
//   useUpdateReviewMutation,
//   useDeleteReviewMutation,
//   useGetAllPendingReviewsQuery,
// } = reviewApi;

import { baseApi } from "./baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Patient review submit
    submitReview: builder.mutation({
      query: (reviewData) => ({
        url: "/review/submit",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["MyReviews", "DoctorReviews", "AllReviews"],
    }),

    // Doctor er reviews fetch
    getDoctorReviews: builder.query({
      query: ({ doctorId, status = "approved" }) => ({
        url: `/review/doctor/${doctorId}?status=${status}`,
        method: "GET",
      }),
      providesTags: ["DoctorReviews"],
    }),

    // Admin review moderate
    moderateReview: builder.mutation({
      query: ({ reviewId, status }) => ({
        url: `/review/moderate/${reviewId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["AllReviews", "DoctorReviews"],
    }),

    // Patient er own reviews
    getMyReviews: builder.query({
      query: () => ({
        url: "/review/my-reviews",
        method: "GET",
      }),
      providesTags: ["MyReviews"],
    }),

    // Review update
    updateReview: builder.mutation({
      query: ({ reviewId, rating, comment }) => ({
        url: `/review/update/${reviewId}`,
        method: "PUT",
        body: { rating, comment },
      }),
      invalidatesTags: ["MyReviews", "DoctorReviews", "AllReviews"],
    }),

    // Review delete
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/review/delete/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MyReviews", "DoctorReviews", "AllReviews"],
    }),

    // Admin er jonno all reviews (all status)
    getAllReviews: builder.query({
      query: ({ status = "all", page = 1, limit = 50 }) => ({
        url: `/review/all?status=${status}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["AllReviews"],
    }),
  }),
});

export const {
  useSubmitReviewMutation,
  useGetDoctorReviewsQuery,
  useModerateReviewMutation,
  useGetMyReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetAllReviewsQuery, // NEW HOOK
} = reviewApi;
