<!-- src/components/social-assistance/CardStatus.vue -->
<script setup>
import { computed } from "vue";

const props = defineProps({
  available: {
    type: Boolean,
    required: true,
  },
});

const status = computed(() => {
  return props.available
    ? {
        label: "Tersedia",
        icon: "tick-square-dark-green.svg",
        bg: "bg-desa-foreshadow",
        color: "text-desa-dark-green",
      }
    : {
        label: "Tidak Tersedia",
        icon: "minus-square-red.svg",
        bg: "bg-desa-red/10",
        color: "text-desa-red",
      };
});
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      class="flex size-[52px] rounded-2xl items-center justify-center overflow-hidden"
      :class="status.bg"
    >
      <img
        :src="`/src/assets/images/icons/${status.icon}`"
        class="size-6"
        alt="status"
      />
    </div>

    <div class="flex flex-col gap-1">
      <p class="font-semibold text-lg leading-5" :class="status.color">
        {{ status.label }}
      </p>
      <p class="font-medium text-sm text-desa-secondary">Status Bansos</p>
    </div>
  </div>
</template>
