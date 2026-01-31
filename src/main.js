import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";

import "./index.css";

import App from "./App.vue";
import router from "./router";
import { logger } from "@/utils/helpers";

// ✅ Notivue
import { createNotivue } from "notivue";
import { notivueConfig } from "@/config/notivue.config";
import "notivue/notifications.css";
import "notivue/notification-progress.css";
import "notivue/animations.css";

// ==========================
// 🔥 TanStack Query Client
// ==========================
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60, // 1 menit
    },
  },
});

// ==========================
// Create app
// ==========================
const app = createApp(App);
const pinia = createPinia();
const notivue = createNotivue(notivueConfig);

// ==========================
// Install plugins (URUTAN PENTING)
// ==========================
app.use(pinia);
app.use(VueQueryPlugin, { queryClient }); // 🔥 TanStack
app.use(notivue);
app.use(router);

// ==========================
// Mount
// ==========================
app.mount("#app");

logger.success("App mounted successfully");
