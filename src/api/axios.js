// src/api/axios.js
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";
import { tokenService } from "@/services/token.service"; // ✅ Added
import { API_CONFIG, HTTP_STATUS } from "@/utils/constants";
import { notificationService } from "@/services/notification.service";
import { ERROR_MESSAGES } from "@/config/messages.config";
import { ROUTE_NAMES } from "@/config/routes.config";
import { logger } from "@/utils/helpers";

export const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
    "X-Requested-With": "XMLHttpRequest",
  },
  // withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.get(); // ✅ Use tokenService

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
  async (error) => {
    // ✅ Make async
    const { config: originalRequest, response } = error;
    const status = response?.status;

    logger.error(`Error ${status} from ${originalRequest?.url}`);

    // Handle 401 Unauthorized (except login endpoint)
    if (shouldHandleUnauthorized(status, originalRequest)) {
      await handleUnauthorized(); // ✅ Await
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
 * ✅ REFACTORED: Handle 401 Unauthorized
 */
async function handleUnauthorized() {
  logger.warn("Session expired, logging out");

  const authStore = useAuthStore();
  const redirectRoute = authStore.handleSessionExpired();

  // ✅ Navigate only if not already on login page
  const currentRoute = router.currentRoute.value.name;
  if (currentRoute !== ROUTE_NAMES.LOGIN) {
    await router.push(redirectRoute);
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

  const currentRoute = router.currentRoute.value.name;
  if (currentRoute !== ROUTE_NAMES.ERROR_403) {
    router.push({ name: ROUTE_NAMES.ERROR_403 });
  }
}
