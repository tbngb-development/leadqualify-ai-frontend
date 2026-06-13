import { AUTH_ENDPOINTS } from "@/constants/api-routes/auth-endpoint";
import { ADMIN_ROUTES } from "@/constants/routes/admin.routes";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true, // sends httpOnly cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// track if refresh is already in progress to avoid infinite loops
let isRefreshing = false;

// queue failed requests while refresh is in progress
type QueueItem = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};

let failedQueue: QueueItem[] = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // only attempt refresh on 401 and if not already retried
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // don't refresh if the failed request IS the refresh endpoint
    if (originalRequest.url?.includes("/auth/refresh")) {
      clearStoreAndRedirect();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // queue this request until refresh completes
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post(AUTH_ENDPOINTS.REFRESH_TOKEN);
      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError);
      clearStoreAndRedirect();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

function clearStoreAndRedirect() {
  if (typeof window === "undefined") return;

  window.location.href = ADMIN_ROUTES.LOGIN;
}

export default api;
