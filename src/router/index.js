// src/router/index.js

import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { ROUTE_NAMES, ROUTE_PATHS, SIDEBAR_KEYS } from "@/config/routes.config";
import { logger } from "@/utils/helpers";

// Layouts
import Auth from "@/layouts/Auth.vue";
import Main from "@/layouts/Main.vue";

// Views
import Dashboard from "@/views/Dashboard.vue";
import Login from "@/views/Login.vue";
import HeadOfFamilies from "@/views/head-of-family/HeadOfFamilies.vue";
import HeadOfFamily from "@/views/head-of-family/HeadOfFamily.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Main,
      children: [
        {
          path: "",
          name: ROUTE_NAMES.DASHBOARD,
          component: Dashboard,
          meta: {
            requiresAuth: true,
            permission: "dashboard-menu",
            sidebarKey: SIDEBAR_KEYS.DASHBOARD,
          },
        },
        {
          path: ROUTE_PATHS.HEAD_OF_FAMILY,
          name: ROUTE_NAMES.HEAD_OF_FAMILY,
          component: HeadOfFamilies,
          meta: {
            requiresAuth: true,
            permission: "head-of-family-list",
            sidebarKey: SIDEBAR_KEYS.HEAD_OF_FAMILY,
          },
        },
        {
          path: ROUTE_PATHS.ID_HEAD_OF_FAMILY,
          name: ROUTE_NAMES.MANAGE_HEAD_OF_FAMILY,
          component: HeadOfFamily,
          meta: {
            requiresAuth: true,
            permission: "head-of-family-list",
            sidebarKey: SIDEBAR_KEYS.HEAD_OF_FAMILY,
          },
        },
      ],
    },
    {
      path: "/login",
      component: Auth,
      children: [
        {
          path: "",
          name: ROUTE_NAMES.LOGIN,
          component: Login,
          meta: { requiresUnauth: true },
        },
      ],
    },
    {
      path: "/403",
      name: ROUTE_NAMES.ERROR_403,
      component: () => import("@/views/Error403.vue"),
    },
  ],
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  logger.info(`Navigating: ${from.name} → ${to.name}`);

  // Handle protected routes
  if (to.meta.requiresAuth) {
    return await handleProtectedRoute(to, authStore, next);
  }

  // Redirect authenticated users away from auth pages
  if (to.meta.requiresUnauth && authStore.isAuthenticated) {
    logger.info("Already authenticated, redirecting to dashboard");
    return next({ name: ROUTE_NAMES.DASHBOARD });
  }

  next();
});

/**
 * Handle protected route access
 */
async function handleProtectedRoute(to, authStore, next) {
  // Check if user has token
  if (!authStore.token) {
    logger.warn("No token, redirecting to login");
    return next({ name: ROUTE_NAMES.LOGIN });
  }

  try {
    // Fetch user if not already loaded
    if (!authStore.user) {
      logger.info("Fetching user data...");
      await authStore.fetchUser();
    }

    // Verify user data exists
    if (!authStore.user) {
      logger.error("User fetch failed");
      return next({ name: ROUTE_NAMES.LOGIN });
    }

    // Check permission if required
    if (!hasRequiredPermission(to, authStore)) {
      logger.warn(`Permission denied: ${to.meta.permission}`);
      return next({ name: ROUTE_NAMES.ERROR_403 });
    }

    logger.success("Auth check passed");
    next();
  } catch (error) {
    logger.error("Auth check failed", error);
    next({ name: ROUTE_NAMES.LOGIN });
  }
}

/**
 * Check if user has required permission
 */
function hasRequiredPermission(route, authStore) {
  if (!route.meta.permission) return true;
  return authStore.hasPermission(route.meta.permission);
}

export default router;
