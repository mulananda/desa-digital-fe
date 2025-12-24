// src/config/messages.config.js

export const ERROR_MESSAGES = {
  NETWORK:
    "Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda.",
  SESSION_EXPIRED: "Sesi Anda telah berakhir. Silakan login kembali.",
  FORBIDDEN: "Anda tidak memiliki izin untuk melakukan aksi ini.",
  SERVER_ERROR: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
  LOGIN_INVALID: "Email atau password yang Anda masukkan salah",
  UNKNOWN: "Terjadi kesalahan. Silakan coba beberapa saat lagi.",
  INVALID_TOKEN: "Token tidak valid",
  INVALID_USER_DATA: "Data pengguna tidak valid",
};

export const SUCCESS_MESSAGES = {
  LOGIN: {
    title: "Login Berhasil",
    message: "Selamat Datang...",
  },
  LOGOUT: {
    title: "Sampai Jumpa",
    message: "Anda telah logout",
  },
};

export const WARNING_MESSAGES = {
  SESSION_EXPIRED: {
    title: "Sesi Berakhir",
    message: "Silakan login kembali untuk melanjutkan",
  },
};
