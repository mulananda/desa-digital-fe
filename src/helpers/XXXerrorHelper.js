// src/helpers/errorHelper.js
import { notificationService } from "@/services/notification.service";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";

export function handleError(error) {
  const response = error?.response;

  // Error network / CORS / server mati
  if (!response) {
    notificationService.error(
      "Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda."
    );
    return null;
  }

  const status = response.status;
  const message =
    response.data?.message ||
    "Terjadi kesalahan. Silakan coba beberapa saat lagi.";

  switch (status) {
    case 422:
      // Validasi Laravel (ditampilkan di form, bukan toast)
      return response.data.errors || { _error: message };

    case 401: {
      const authStore = useAuthStore();
      authStore.logout?.();

      notificationService.error(
        "Sesi Anda telah berakhir. Silakan login kembali."
      );

      router.push("/login");
      break;
    }

    case 403:
      notificationService.error(
        "Anda tidak memiliki izin untuk melakukan aksi ini."
      );
      break;

    case 400:
      notificationService.error(message);
      break;

    case 500:
      notificationService.error(
        "Terjadi kesalahan pada server. Silakan coba lagi nanti."
      );
      break;

    default:
      notificationService.error(message);
  }

  return null;
}
