// src/config/routes.config.js

export const ROUTE_NAMES = {
  DASHBOARD: "dashboard",
  LOGIN: "login",
  ERROR_403: "Error403",
  HEAD_OF_FAMILY: "head-of-family",
  MANAGE_HEAD_OF_FAMILY: "manage-head-of-family",
  CREATE_HEAD_OF_FAMILY: "create-head-of-family",
  SOCIAL_ASSISTANCE: "social-assistance",
  MANAGE_SOCIAL_ASSISTANCE: "manage-social-assistance",
  EDIT_SOCIAL_ASSISTANCE: "edit-social-assistance",
  CREATE_SOCIAL_ASSISTANCE: "create-social-assistance",
  SOCIAL_ASSISTANCE_RECIPIENT: "social-assistance-recipient",
};

export const ROUTE_PATHS = {
  DASHBOARD: "/",
  LOGIN: "/login",
  ERROR_403: "/403",
  HEAD_OF_FAMILY: "/head-of-family",
  ID_HEAD_OF_FAMILY: "/head-of-family/:id",
  CREATE_HEAD_OF_FAMILY: "/head-of-family/create",
  SOCIAL_ASSISTANCE: "/social-assistance",
  ID_SOCIAL_ASSISTANCE: "/social-assistance/:id",
  EDIT_SOCIAL_ASSISTANCE: "/social-assistance/edit/:id",
  CREATE_SOCIAL_ASSISTANCE: "/social-assistance/create",
  SOCIAL_ASSISTANCE_RECIPIENT: "/social-assistance-recipient",
};

// untuk aktif sidebar
export const SIDEBAR_KEYS = {
  DASHBOARD: "dashboard",
  HEAD_OF_FAMILY: "head-of-family",
  SOCIAL_ASSISTANCE: "social-assistance",
  SOCIAL_ASSISTANCE_RECIPIENT: "social-assistance-recipient",
};
