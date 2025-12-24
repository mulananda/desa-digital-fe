// src/services/auth.service.js

import { axiosInstance } from "@/api/axios";
import { tokenService } from "./token.service";
import { sanitizeEmail, isValidToken } from "@/utils/helpers";
import { ERROR_MESSAGES } from "@/config/messages.config";

class AuthService {
  /**
   * Login user
   */
  async login(credentials) {
    const sanitized = this.sanitizeCredentials(credentials);
    const response = await axiosInstance.post("/login", sanitized);

    this.validateLoginResponse(response.data);

    return response.data;
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await axiosInstance.post("/logout");
    } catch (error) {
      // Ignore logout API errors, clear local data anyway
      console.warn("Logout API failed, clearing local data");
    }
  }

  /**
   * Fetch current user data
   */
  async fetchUser() {
    const response = await axiosInstance.get("/me");

    this.validateUserResponse(response.data);

    return response.data.data;
  }

  /**
   * Clear local session
   */
  clearSession() {
    tokenService.remove();
  }

  /**
   * Sanitize login credentials
   */
  sanitizeCredentials(credentials) {
    return {
      email: sanitizeEmail(credentials.email),
      password: credentials.password,
      role: credentials.role,
    };
  }

  /**
   * Validate login response
   */
  validateLoginResponse(data) {
    if (!data?.token) {
      throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
    }

    if (!isValidToken(data.token)) {
      throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }

  /**
   * Validate user data response
   */
  validateUserResponse(data) {
    if (!data?.data) {
      throw new Error(ERROR_MESSAGES.INVALID_USER_DATA);
    }
  }
}

export const authService = new AuthService();
