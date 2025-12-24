// src/services/notification.service.js

import { push } from "notivue";

class NotificationService {
  success(message, title = "Berhasil") {
    push.success({
      title,
      message,
      duration: 4000,
    });
  }

  error(message, title = "Error") {
    push.error({
      title,
      message,
      duration: 5000, // ← Error duration lebih lama
    });
  }

  warning(message, title = "Peringatan") {
    push.warning({
      title,
      message,
      duration: 5000,
    });
  }

  info(message, title = "Informasi") {
    push.info({
      title,
      message,
      duration: 3000,
    });
  }

  // For async operations
  promise(promise, messages) {
    return push.promise(promise, {
      loading: messages.loading || "Memproses...",
      success: messages.success || "Berhasil!",
      error: messages.error || "Gagal!",
    });
  }

  // Custom duration
  custom(type, message, title, duration = 4000) {
    push[type]({
      title,
      message,
      duration,
    });
  }

  // Clear all notifications
  clearAll() {
    push.clearAll();
  }
}

export const notificationService = new NotificationService();
