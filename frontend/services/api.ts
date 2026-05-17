"use client";

import axios from "axios";

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    "https://team-task-manager-backend-production-9d3f.up.railway.app/api",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original?._retry && !original?.url?.includes("/auth/refresh")) {
      original._retry = true;
      const { data } = await api.post("/auth/refresh", {
        refreshToken: localStorage.getItem("refreshToken")
      });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    }
    return Promise.reject(error);
  }
);
