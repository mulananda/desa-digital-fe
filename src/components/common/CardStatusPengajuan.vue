<script setup lang="ts">
import { computed } from "vue";

type Status = "pending" | "approved" | "rejected";

const props = defineProps<{
  status: Status;
}>();

const statusMap = {
  pending: {
    label: "Menunggu",
    class: "bg-desa-yellow",
  },
  approved: {
    label: "Disetujui",
    class: "bg-desa-green",
  },
  rejected: {
    label: "Ditolak",
    class: "bg-desa-red",
  },
} as const;

const badge = computed(() => statusMap[props.status]);
</script>

<template>
  <div
    v-if="badge"
    class="badge rounded-full p-3 flex w-[100px] justify-center shrink-0"
    :class="badge.class"
  >
    <span class="font-semibold text-xs text-white uppercase">
      {{ badge.label }}
    </span>
  </div>
</template>
