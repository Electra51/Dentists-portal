// // src/redux/store.js
// import { configureStore } from "@reduxjs/toolkit";
// import { authApi } from "./api/authApi";
// import { adminApi } from "./api/adminApi";
// import { doctorApi } from "./api/doctorApi";
// import { appointmentApi } from "./api/appointmentApi";
// import { prescriptionApi } from "./api/prescriptionApi";
// import { dashboardApi } from "./api/dashboardApi";
// export const store = configureStore({
//   reducer: {
//     [authApi.reducerPath]: authApi.reducer,
//     [adminApi.reducerPath]: adminApi.reducer,
//     [doctorApi.reducerPath]: doctorApi.reducer,
//     [appointmentApi.reducerPath]: appointmentApi.reducer,
//     [prescriptionApi.reducerPath]: prescriptionApi.reducer,
//     [dashboardApi.reducerPath]: dashboardApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware()
//       .concat(authApi.middleware)
//       .concat(adminApi.middleware)
//       .concat(doctorApi.middleware)
//       .concat(prescriptionApi.middleware)
//       .concat(appointmentApi.middleware)
//       .concat(dashboardApi.middleware),
// });

import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});
