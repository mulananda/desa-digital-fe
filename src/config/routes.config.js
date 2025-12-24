// src/config/routes.config.js

export const ROUTE_NAMES = {
  DASHBOARD: "dashboard",
  LOGIN: "login",
  ERROR_403: "Error403",
  HEAD_OF_FAMILY: "head-of-family",
  MANAGE_HEAD_OF_FAMILY: "manage-head-of-family",
};

export const ROUTE_PATHS = {
  DASHBOARD: "/",
  LOGIN: "/login",
  ERROR_403: "/403",
  HEAD_OF_FAMILY: "/head-of-family",
  ID_HEAD_OF_FAMILY: "/head-of-family/:id",
};

// untuk aktif sidebar
export const SIDEBAR_KEYS = {
  DASHBOARD: "dashboard",
  HEAD_OF_FAMILY: "head-of-family",
};

// Centralized redirect logic
export class RouteService {
  constructor(router) {
    this.router = router;
  }

  toDashboard() {
    return this.router.push({ name: ROUTE_NAMES.DASHBOARD });
  }

  toLogin() {
    return this.router.push({ name: ROUTE_NAMES.LOGIN });
  }

  toForbidden() {
    return this.router.push({ name: ROUTE_NAMES.ERROR_403 });
  }

  isCurrentRoute(routeName) {
    return this.router.currentRoute.value.name === routeName;
  }

  shouldRedirectToLogin() {
    return !this.isCurrentRoute(ROUTE_NAMES.LOGIN);
  }

  shouldRedirectToForbidden() {
    return !this.isCurrentRoute(ROUTE_NAMES.ERROR_403);
  }
}
