<script setup>
/**
 * ErrorBoundary.vue
 *
 * Vue 3 Error Boundary component menggunakan onErrorCaptured.
 * Menangkap error dari semua child component dan menampilkan ErrorState.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <RouterView />
 *   </ErrorBoundary>
 */
import { ref, onErrorCaptured } from "vue";
import ErrorState from "@/components/ui/state/ErrorState.vue";
import { logger } from "@/utils/helpers";

const error = ref(null);
const errorInfo = ref("");

onErrorCaptured((err, instance, info) => {
  error.value = err;
  errorInfo.value = info;
  logger.error("ErrorBoundary caught:", err, info);

  // Return false → prevent error from propagating further up
  return false;
});

function handleRetry() {
  error.value = null;
  errorInfo.value = "";
}

function handleBack() {
  error.value = null;
  errorInfo.value = "";
  window.history.back();
}
</script>

<template>
  <ErrorState
    v-if="error"
    :error="error"
    title="Terjadi Kesalahan, Silahkan coba lagi"
    :show-details="true"
    @retry="handleRetry"
    @back="handleBack"
  />
  <slot v-else />
</template>
