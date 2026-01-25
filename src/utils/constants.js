// src/utils/constants.js

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  TIMEOUT: 30000, // 30 seconds
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE: 422,
  SERVER_ERROR: 500,
};

// Auth Configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: "token",
  // TOKEN_EXPIRY_DAYS: 7,
};

// Cookie Options
export const COOKIE_OPTIONS = {
  secure: import.meta.env.PROD, // Only HTTPS in production
  sameSite: "strict",
  path: "/",
};
