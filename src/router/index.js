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
import HeadOfFamilyCreate from "@/views/head-of-family/HeadOfFamilyCreate.vue";
import SocialAssistances from "@/views/social-assistance/SocialAssistances.vue";
import SocialAssistance from "@/views/social-assistance/SocialAssistance.vue";
import SocialAssistanceEdit from "@/views/social-assistance/SocialAssistanceEdit.vue";

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
            // permission: sesuai permission seeder di API backend
            permission: "dashboard-menu",
            // aktif sidebar
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
        {
          path: ROUTE_PATHS.CREATE_HEAD_OF_FAMILY,
          name: ROUTE_NAMES.CREATE_HEAD_OF_FAMILY,
          component: HeadOfFamilyCreate,
          meta: {
            requiresAuth: true,
            permission: "head-of-family-create",
            sidebarKey: SIDEBAR_KEYS.HEAD_OF_FAMILY,
          },
        },
        {
          path: ROUTE_PATHS.SOCIAL_ASSISTANCE,
          name: ROUTE_NAMES.SOCIAL_ASSISTANCE,
          component: SocialAssistances,
          meta: {
            requiresAuth: true,
            permission: "social-assistance-list",
            sidebarKey: SIDEBAR_KEYS.SOCIAL_ASSISTANCE,
          },
        },
        {
          path: ROUTE_PATHS.ID_SOCIAL_ASSISTANCE,
          name: ROUTE_NAMES.MANAGE_SOCIAL_ASSISTANCE,
          component: SocialAssistance,
          meta: {
            requiresAuth: true,
            permission: "social-assistance-list",
            sidebarKey: SIDEBAR_KEYS.SOCIAL_ASSISTANCE,
          },
        },
        {
          path: ROUTE_PATHS.EDIT_SOCIAL_ASSISTANCE,
          name: ROUTE_NAMES.EDIT_SOCIAL_ASSISTANCE,
          component: SocialAssistanceEdit,
          meta: {
            requiresAuth: true,
            permission: "social-assistance-edit",
            sidebarKey: SIDEBAR_KEYS.SOCIAL_ASSISTANCE,
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

/**
 * ============================
 * NAVIGATION GUARD
 * ============================
 */
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();

  // 1. Initialize token if not exists (sync, non-blocking)
  if (!authStore.token) {
    authStore.initializeAuth();
  }

  logger.info(`Navigating: ${from.name ?? "INIT"} → ${to.name}`);

  // 2. Redirect authenticated users from auth pages
  if (to.meta.requiresUnauth && authStore.isAuthenticated) {
    logger.info("Already authenticated → redirect to dashboard");
    return { name: ROUTE_NAMES.DASHBOARD };
  }

  // 3. Handle protected routes
  if (to.meta.requiresAuth) {
    // No token → redirect to login
    if (!authStore.token) {
      logger.warn("No token → redirect to login");
      return { name: ROUTE_NAMES.LOGIN };
    }

    // Lazy fetch user data if not exists
    if (!authStore.user) {
      try {
        logger.info("Fetching user data...");
        await authStore.fetchUser();
      } catch (error) {
        logger.error("Fetch user failed → login", error);
        return { name: ROUTE_NAMES.LOGIN };
      }
    }

    // Check permission
    const requiredPermission = to.meta.permission;
    if (requiredPermission && !authStore.hasPermission(requiredPermission)) {
      logger.warn(`Permission denied: ${requiredPermission}`);
      return { name: ROUTE_NAMES.ERROR_403 };
    }
  }

  // 4. Allow navigation
  return true;
});

export default router;
