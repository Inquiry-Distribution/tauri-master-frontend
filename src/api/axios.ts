// src/lib/api/axios.ts

import axios from "axios";
import { navigateTo } from "./navigate";
// import { useNavigate } from "react-router-dom";

// const BASE_URL = process.env.VITE_PUBLIC_API_URL || "http://127.0.0.1:3000";
const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || "http://127.0.0.1:3000";

export const api = axios.create({
  baseURL: BASE_URL,
});

// Token helpers
const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// REQUEST INTERCEPTOR → attach token
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR → handle refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // const navigate = useNavigate();
    const originalRequest = error.config;

    // ❌ skip refresh for auth routes
    const isAuthRoute =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/logout");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await api.post("/auth/refresh-token", {
          refreshToken: getRefreshToken(),
        });

        const { token, refresh_token } = res.data.data;

        localStorage.setItem("access_token", token);
        if (refresh_token) {
          localStorage.setItem("refresh_token", refresh_token);
        }

        processQueue(null, token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        // navigate("/login");
        window.location.href = "/#/login";
        // navigateTo("/login");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;

    //   const refreshToken = getRefreshToken();

    //   if (!refreshToken) {
    //     window.location.href = "/login";
    //     return Promise.reject(error);
    //   }

    //   try {
    //     const res = await axios.post(`${BASE_URL}/auth/refresh`, {
    //       refreshToken: refreshToken,
    //     });

    //     const newAccessToken = res.data.access_token;

    //     localStorage.setItem("access_token", newAccessToken);

    //     // retry original request
    //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    //     return api(originalRequest);
    //   } catch (err) {
    //     localStorage.clear();
    //     window.location.href = "/login";
    //     return Promise.reject(err);
    //   }
    // }

    return Promise.reject(error);
  },
);
