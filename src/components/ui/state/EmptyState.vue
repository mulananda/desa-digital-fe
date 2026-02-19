<script setup>
defineProps({
  label: {
    type: String,
    default: "Data tidak tersedia",
  },
});
</script>

<template>
  <div class="flex justify-center py-12">
    <p class="text-sm font-medium text-desa-secondary">
      {{ label }}
    </p>
  </div>
</template>
