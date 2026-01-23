// src/config/routes.config.js

export const ROUTE_NAMES = {
  DASHBOARD: "dashboard",
  LOGIN: "login",
  ERROR_403: "Error403",
  HEAD_OF_FAMILY: "head-of-family",
  MANAGE_HEAD_OF_FAMILY: "manage-head-of-family",
  CREATE_HEAD_OF_FAMILY: "create-head-of-family",
};

export const ROUTE_PATHS = {
  DASHBOARD: "/",
  LOGIN: "/login",
  ERROR_403: "/403",
  HEAD_OF_FAMILY: "/head-of-family",
  ID_HEAD_OF_FAMILY: "/head-of-family/:id",
  CREATE_HEAD_OF_FAMILY: "/head-of-family/create",
};

// untuk aktif sidebar
export const SIDEBAR_KEYS = {
  DASHBOARD: "dashboard",
  HEAD_OF_FAMILY: "head-of-family",
};
