// src/main.js
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
      staleTime: 30_000, // ⬅️ Data dianggap fresh selama 30 detik
      gcTime: 5 * 60_000, // v5 (pengganti cacheTime) waktu 5 Menit
      refetchOnWindowFocus: false,
      retry: 1,
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
