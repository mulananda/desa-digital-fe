<script setup>
defineProps({
  label: {
    type: String,
    default: "Memuat data...",
  },
});
</script>

<template>
  <div class="flex justify-center py-12">
    <div class="flex flex-col items-center gap-3">
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2 border-desa-dark-green"
      />
      <p class="text-desa-secondary text-sm">
        {{ label }}
      </p>
    </div>
  </div>
</template>
