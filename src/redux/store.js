// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { adminApi } from "./api/adminApi";
import { doctorApi } from "./api/doctorApi";
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [doctorApi.reducerPath]: doctorApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(adminApi.middleware)
      .concat(doctorApi.middleware),
});
