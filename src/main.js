import { createApp } from "vue";
import { createPinia } from "pinia";

import "./index.css";

import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "@/stores/auth";
import { logger } from "@/utils/helpers";

// ✅ Import Notivue
import { createNotivue } from "notivue";
import { notivueConfig } from "@/config/notivue.config";
import "notivue/notifications.css"; // Styles
import "notivue/notification-progress.css";
import "notivue/animations.css"; // Animations

// Create app
const app = createApp(App);
const pinia = createPinia();

// ✅ Create Notivue instance
const notivue = createNotivue(notivueConfig);

// Install plugins
app.use(pinia);
app.use(notivue); // ← Add this

// Mount app
app.use(router);
app.mount("#app");

logger.success("App mounted successfully");
