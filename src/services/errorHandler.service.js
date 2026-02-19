// src/services/errorHandler.service.js

import { notificationService } from "@/services/notification.service";
import { HTTP_STATUS } from "@/utils/constants";
import { ERROR_MESSAGES } from "@/config/messages.config";
import { logger } from "@/utils/helpers";

class ErrorHandlerService {
  /**
   * Handle API errors with notifications
   * @param {Error} error - Axios error object
   * @param {Object} options - Optional configuration
   * @returns {Object|null} - Validation errors or null
   */
  handle(error, options = {}) {
    const {
      showNotification = true,
      logError = true,
      context = "API",
    } = options;

    if (logError) {
      logger.error(`${context} Error:`, error);
    }

    const response = error?.response;

    // Network error
    if (!response) {
      if (showNotification) {
        notificationService.error(ERROR_MESSAGES.NETWORK);
      }
      return null;
    }

    const status = response.status;
    const message = response.data?.message || ERROR_MESSAGES.UNKNOWN;

    // Handle specific status codes
    const handler = this.getStatusHandler(status);
    return handler(response, message, showNotification);
  }

  /**
   * Get handler function for specific HTTP status
   */
  getStatusHandler(status) {
    const handlers = {
      [HTTP_STATUS.UNPROCESSABLE]: this.handleValidationError,
      [HTTP_STATUS.UNAUTHORIZED]: this.handleUnauthorized,
      [HTTP_STATUS.FORBIDDEN]: this.handleForbidden,
      [HTTP_STATUS.NOT_FOUND]: this.handleNotFound,
      [HTTP_STATUS.BAD_REQUEST]: this.handleBadRequest,
      [HTTP_STATUS.SERVER_ERROR]: this.handleServerError,
    };

    return handlers[status] || this.handleGenericError;
  }

  /**
   * Handle 422 Validation Errors
   */
  handleValidationError = (response, message, showNotification) => {
    // Return validation errors for form display
    return response.data.errors || { _error: message };
  };

  /**
   * Handle 401 Unauthorized - Handled by axios interceptor
   */
  handleUnauthorized = () => {
    // Don't show notification here, handled by interceptor
    return null;
  };

  /**
   * Handle 403 Forbidden
   * Notification & redirect sudah di-handle oleh axios interceptor
   */
  handleForbidden = () => {
    return null;
  };

  /**
   * Handle 404 Not Found
   */
  handleNotFound = (response, message, showNotification) => {
    if (showNotification) {
      notificationService.error("Data yang Anda cari tidak ditemukan.");
    }
    return null;
  };

  /**
   * Handle 400 Bad Request
   */
  handleBadRequest = (response, message, showNotification) => {
    if (showNotification) {
      notificationService.error(message);
    }
    return null;
  };

  /**
   * Handle 500 Server Error
   */
  handleServerError = (response, message, showNotification) => {
    if (showNotification) {
      notificationService.error(ERROR_MESSAGES.SERVER_ERROR);
    }
    return null;
  };

  /**
   * Handle Generic Errors
   */
  handleGenericError = (response, message, showNotification) => {
    if (showNotification) {
      notificationService.error(message);
    }
    return null;
  };

  /**
   * Handle login-specific errors
   */
  handleLoginError(error) {
    const status = error.response?.status;

    if (
      status === HTTP_STATUS.UNAUTHORIZED ||
      status === HTTP_STATUS.UNPROCESSABLE
    ) {
      return ERROR_MESSAGES.LOGIN_INVALID;
    }

    this.handle(error, { context: "Login" });
    return ERROR_MESSAGES.UNKNOWN;
  }
}

export const errorHandlerService = new ErrorHandlerService();
