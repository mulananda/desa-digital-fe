<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "button",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button :type="type" :disabled="loading">
    <span v-if="!loading">{{ label }}</span>
    <span v-else>Loading...</span>
  </button>
</template>
