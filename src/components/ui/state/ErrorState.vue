<script setup>
import { computed } from "vue";

/**
 * Props definition (JS version)
 * Tetap bisa pakai type untuk runtime validation (optional best practice)
 */
const props = defineProps({
  error: {
    type: [Object, String, Error],
    default: null,
  },
  message: {
    type: [String, Object],
    default: null,
  },
  title: {
    type: String,
    default: "Terjadi Kesalahan",
  },
  code: {
    type: [Number, String],
    default: null,
  },
  showDetails: {
    type: Boolean,
    default: false,
  },
  retryable: {
    type: Boolean,
    default: true,
  },
});

/**
 * Emits (JS version)
 */
const emit = defineEmits(["retry", "back"]);

/**
 * Environment check
 */
const isDev = import.meta.env.DEV;

/**
 * Resolve error message (safe normalization)
 */
const errorMessage = computed(() => {
  if (props.message) {
    if (props.message instanceof Error) {
      return props.message.message;
    }
    return props.message;
  }

  if (!props.error) return "Gagal memuat data";

  if (props.error instanceof Error) {
    return props.error.message;
  }

  if (typeof props.error === "string") {
    return props.error;
  }

  return "Terjadi kesalahan tak terduga";
});

/**
 * Show stack/details only in dev mode
 */
const errorDetails = computed(() => {
  if (!isDev || !props.showDetails) return null;

  if (props.error instanceof Error) {
    return {
      message: props.error.message,
      stack: props.error.stack,
    };
  }

  try {
    return JSON.stringify(props.error, null, 2);
  } catch {
    return "Tidak dapat menampilkan detail error";
  }
});
</script>

<template>
  <div class="flex flex-col gap-4 py-12 px-6 items-center justify-center">
    <!-- Error Icon -->
    <div
      class="flex size-[60px] rounded-full bg-red-100 items-center justify-center shrink-0"
    >
      <span class="text-4xl">⚠️</span>
    </div>

    <!-- Error Title -->
    <h3 class="font-semibold text-lg">{{ title }}</h3>

    <!-- Error Message -->
    <p class="text-center text-desa-secondary max-w-md text-sm">
      {{ errorMessage }}
    </p>

    <!-- Error Code (dev only) -->
    <div v-if="isDev && code" class="text-xs text-gray-500 font-mono">
      Error Code: {{ code }}
    </div>

    <!-- Action Buttons -->
    <div v-if="retryable" class="flex gap-3 mt-4">
      <button
        @click="emit('retry')"
        class="flex items-center gap-2 rounded-2xl py-3 px-6 bg-desa-dark-green text-white font-medium hover:opacity-90 transition-opacity"
      >
        Coba Lagi
      </button>
      <button
        @click="emit('back')"
        class="flex items-center gap-2 rounded-2xl py-3 px-6 border border-desa-background font-medium hover:bg-desa-foreshadow transition-colors"
      >
        ← Kembali
      </button>
    </div>

    <!-- Dev Details -->
    <div
      v-if="isDev && errorDetails"
      class="mt-6 p-4 bg-gray-100 rounded-lg max-w-md text-xs font-mono overflow-auto max-h-[200px] w-full"
    >
      <p class="text-gray-600 font-bold mb-2">Error Details:</p>
      <pre class="text-gray-700 whitespace-pre-wrap break-words">{{
        errorDetails
      }}</pre>
    </div>
  </div>
</template>
