// src/api/axios.js

import axios from "axios";
import Cookies from "js-cookie";
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
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    logger.success(`Response from ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    logger.error(`Error ${status} from ${originalRequest?.url}`);

    // Handle 401 Unauthorized (except login endpoint)
    if (shouldHandleUnauthorized(status, originalRequest)) {
      return await handleUnauthorized();
    }

    // Handle 403 Forbidden
    if (status === HTTP_STATUS.FORBIDDEN) {
      return await handleForbidden();
    }

    // Set generic network error message
    if (!error.response) {
      error.message = ERROR_MESSAGES.NETWORK;
    }

    return Promise.reject(error);
  }
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
async function handleUnauthorized() {
  logger.warn("Session expired, logging out");

  // Clear token
  Cookies.remove("token");

  // Import and call auth store
  const { useAuthStore } = await import("@/stores/auth");
  const authStore = useAuthStore();
  authStore.handleSessionExpired();

  // Redirect to login
  const router = await import("@/router");
  const routeService = new (
    await import("@/config/routes.config")
  ).RouteService(router.default);

  if (routeService.shouldRedirectToLogin()) {
    routeService.toLogin();
  }

  return Promise.reject(new Error("Session expired"));
}

/**
 * Handle 403 Forbidden
 */
async function handleForbidden() {
  logger.warn("Access forbidden");

  notificationService.error(
    "Anda tidak memiliki akses ke halaman ini",
    "Akses Ditolak"
  );

  // Redirect to 403 page
  const router = await import("@/router");
  const routeService = new (
    await import("@/config/routes.config")
  ).RouteService(router.default);

  if (routeService.shouldRedirectToForbidden()) {
    routeService.toForbidden();
  }

  return Promise.reject(new Error("Access forbidden"));
}
