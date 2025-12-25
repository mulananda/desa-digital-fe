// src/stores/auth.js
import { defineStore } from "pinia";
import { authService } from "@/services/auth.service";
import { tokenService } from "@/services/token.service";
import { errorHandlerService } from "@/services/errorHandler.service";
import { HTTP_STATUS } from "@/utils/constants";
import router from "@/router";
import { ROUTE_NAMES } from "@/config/routes.config";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: tokenService.get(),
    loading: false,
    loggingOut: false,
    loginError: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userPermissions: (state) => state.user?.permissions || [],
    hasPermission() {
      return (permission) => this.userPermissions.includes(permission);
    },
  },

  actions: {
    initializeAuth() {
      const token = tokenService.get();
      if (token) this.token = token;
    },

    async login(credentials) {
      this.loading = true;
      this.loginError = null;

      try {
        const { token } = await authService.login(credentials);

        tokenService.set(token);
        this.token = token;

        this.user = await authService.fetchUser();

        return this.user; // ⬅️ kunci: signal sukses
      } catch (error) {
        this.loginError = errorHandlerService.handleLoginError(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      if (this.loggingOut) return;
      this.loggingOut = true;

      try {
        await authService.logout();
      } catch {
        // ignore API error
      } finally {
        this.clearAuth();
        this.loggingOut = false;
        await router.replace({ name: ROUTE_NAMES.LOGIN });
      }
    },

    async fetchUser() {
      try {
        this.user = await authService.fetchUser();
        return this.user;
      } catch (error) {
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          this.forceLogout();
        }
        throw error;
      }
    },

    forceLogout() {
      this.clearAuth();
      router.replace({ name: ROUTE_NAMES.LOGIN });
    },

    clearAuth() {
      this.token = null;
      this.user = null;
      this.loginError = null;
      tokenService.remove();
    },
  },
});
