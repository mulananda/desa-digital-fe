<!-- views/Error403.vue -->
<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const goBack = () => {
  router.back();
};

const logout = async () => {
  await authStore.logout();
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-desa-background">
    <div
      class="flex flex-col items-center gap-8 p-8 bg-white rounded-3xl shadow-lg max-w-md"
    >
      <div class="flex flex-col items-center gap-4">
        <div class="text-8xl font-bold text-desa-dark-green">403</div>
        <h1 class="text-2xl font-semibold text-center">Akses Ditolak</h1>
        <p class="text-center text-desa-secondary">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
      </div>

      <div class="flex gap-4 w-full">
        <button
          @click="goBack"
          class="flex-1 px-6 py-3 font-medium text-desa-dark-green bg-white border-2 border-desa-dark-green rounded-xl hover:bg-desa-foreshadow transition-all duration-300"
        >
          Kembali
        </button>
        <button
          @click="logout"
          class="flex-1 px-6 py-3 font-medium text-white bg-desa-dark-green rounded-xl hover:bg-opacity-90 transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>
