// src/api/axios.js

import axios from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";
import { API_CONFIG, HTTP_STATUS } from "@/utils/constants";
import { notificationService } from "@/services/notification.service";
import { ERROR_MESSAGES } from "@/config/messages.config";
import { ROUTE_NAMES } from "@/config/routes.config";
import { logger } from "@/utils/helpers";

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      logger.info(`Request to ${config.url}`);
    }

    return config;
  },
  (error) => {
    logger.error("Request error", error);
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    logger.success(`Response from ${response.config.url}`);
    return response;
  },
  (error) => {
    const { config: originalRequest, response } = error;
    const status = response?.status;

    logger.error(`Error ${status} from ${originalRequest?.url}`);

    // Handle 401 Unauthorized (except login endpoint)
    if (shouldHandleUnauthorized(status, originalRequest)) {
      handleUnauthorized();
      return Promise.reject(new Error("Session expired"));
    }

    // Handle 403 Forbidden
    if (status === HTTP_STATUS.FORBIDDEN) {
      handleForbidden();
      return Promise.reject(new Error("Access forbidden"));
    }

    // Set generic network error message
    if (!response) {
      error.message = ERROR_MESSAGES.NETWORK;
    }

    return Promise.reject(error);
  },
);

/**
 * Check if should handle 401 error
 */
function shouldHandleUnauthorized(status, request) {
  const isLoginRequest = request?.url?.includes("/login");
  return (
    status === HTTP_STATUS.UNAUTHORIZED && !request._retry && !isLoginRequest
  );
}

/**
 * Handle 401 Unauthorized
 */
function handleUnauthorized() {
  logger.warn("Session expired, logging out");

  // Clear token
  Cookies.remove("token");

  // Call auth store to handle session expiration
  const authStore = useAuthStore();
  authStore.handleSessionExpired();

  // Redirect to login if not already there
  const currentRoute = router.currentRoute.value.name;
  if (currentRoute !== ROUTE_NAMES.LOGIN) {
    router.push({ name: ROUTE_NAMES.LOGIN });
  }
}

/**
 * Handle 403 Forbidden
 */
function handleForbidden() {
  logger.warn("Access forbidden");

  notificationService.error(
    "Anda tidak memiliki akses ke halaman ini",
    "Akses Ditolak",
  );

  // Redirect to 403 page if not already there
  const currentRoute = router.currentRoute.value.name;
  if (currentRoute !== ROUTE_NAMES.ERROR_403) {
    router.push({ name: ROUTE_NAMES.ERROR_403 });
  }
}
