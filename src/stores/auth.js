// src/stores/auth.js

import { defineStore } from "pinia";
import { authService } from "@/services/auth.service";
import { tokenService } from "@/services/token.service";
import { notificationService } from "@/services/notification.service";
import { errorHandlerService } from "@/services/errorHandler.service";
import { HTTP_STATUS } from "@/utils/constants";
import { SUCCESS_MESSAGES, WARNING_MESSAGES } from "@/config/messages.config";
import { logger } from "@/utils/helpers";
import router from "@/router";
import { ROUTE_NAMES } from "@/config/routes.config";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    loggingOut: false,
    loginError: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userPermissions: (state) => state.user?.permissions || [],
    hasPermission: (state) => (permission) => {
      return state.userPermissions.includes(permission);
    },
  },

  actions: {
    /**
     * Initialize auth from stored token
     */
    initializeAuth() {
      const token = tokenService.get();
      if (token) {
        this.token = token;
        logger.info("Auth initialized from cookies");
      }
    },

    /**
     * Login user
     */
    async login(credentials) {
      this.loading = true;
      this.loginError = null;

      try {
        const data = await authService.login(credentials);

        // Save token
        tokenService.set(data.token);
        this.token = data.token;

        // Fetch user data
        await this.fetchUser();

        // Navigate to dashboard
        await router.push({ name: ROUTE_NAMES.DASHBOARD });

        // Show success notification
        notificationService.success(
          SUCCESS_MESSAGES.LOGIN.message,
          SUCCESS_MESSAGES.LOGIN.title
        );
      } catch (error) {
        const message = errorHandlerService.handleLoginError(error);

        if (message) {
          this.loginError = message; // simpan error
        }
        this.clearAuth();
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Logout user
     */
    async logout() {
      if (this.loggingOut) return;

      this.loggingOut = true;

      try {
        await authService.logout();
        notificationService.info(
          SUCCESS_MESSAGES.LOGOUT.message,
          SUCCESS_MESSAGES.LOGOUT.title
        );
      } catch (error) {
        logger.warn("Logout API failed, clearing local data");
      } finally {
        this.clearAuth();
        this.loggingOut = false;
        logger.info("Logout successful");
        // router.push({ name: ROUTE_NAMES.LOGIN });
        // router.replace (tidak bisa klik Back ke halaman protected, lebih amana utk Auth)
        await router.replace({ name: ROUTE_NAMES.LOGIN });
      }
    },

    /**
     * Fetch current user data
     */
    async fetchUser() {
      try {
        this.user = await authService.fetchUser();
        logger.success("User data fetched");
        return this.user;
      } catch (error) {
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          await this.logout();
        }
        throw error;
      }
    },

    // Supaya tidak double confirm / double API call saat token expired.
    forceLogout() {
      this.clearAuth();
      router.replace({ name: ROUTE_NAMES.LOGIN });
    },

    /**
     * Handle session expired (called by axios interceptor)
     */
    handleSessionExpired() {
      this.forceLogout();
      notificationService.warning(
        WARNING_MESSAGES.SESSION_EXPIRED.message,
        WARNING_MESSAGES.SESSION_EXPIRED.title
      );
    },

    /**
     * Clear authentication state
     */
    clearAuth() {
      this.token = null;
      this.user = null;
      tokenService.remove();
    },
  },
});
