<!-- src/components/ui/Pagination.vue -->
<script setup>
import { computed } from "vue";

const props = defineProps({
  meta: { type: Object, required: true },
  serverOptions: { type: Object, required: true },
});

const emit = defineEmits(["update:page"]);

const currentPage = computed(() => props.meta.current_page);
const lastPage = computed(() => props.meta.last_page);

const canGoPrevious = computed(() => currentPage.value > 1);
const canGoNext = computed(() => currentPage.value < lastPage.value);

/**
 * Generate smart pagination range with ellipsis
 */
const paginationRange = computed(() => {
  const total = lastPage.value;
  const current = currentPage.value;
  const delta = 2;

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([
    1,
    total,
    ...Array.from({ length: delta * 2 + 1 }, (_, i) => current - delta + i),
  ]);

  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  return sorted.reduce((acc, page, index) => {
    const prev = sorted[index - 1];
    if (prev && page - prev > 1) acc.push("...");
    acc.push(page);
    return acc;
  }, []);
});

const goToPage = (page) => {
  if (typeof page === "number" && page !== currentPage.value) {
    emit("update:page", page);
  }
};

const previousPage = () =>
  canGoPrevious.value && goToPage(currentPage.value - 1);
const nextPage = () => canGoNext.value && goToPage(currentPage.value + 1);
</script>

<template>
  <nav id="Pagination" v-if="meta.last_page > 1">
    <ul class="flex items-center gap-3">
      <!-- Previous -->
      <li class="group">
        <button
          @click="previousPage"
          :disabled="!canGoPrevious"
          class="flex size-11 items-center justify-center rounded-full bg-desa-foreshadow transition-setup disabled:cursor-not-allowed enabled:hover:bg-desa-dark-green"
        >
          <img
            src="@/assets/images/icons/arrow-left-dark-green.svg"
            class="size-6"
            :class="{ 'group-hover:hidden': !canGoPrevious }"
          />
          <img
            src="@/assets/images/icons/arrow-left-foreshadow.svg"
            class="hidden size-6"
            :class="{ 'group-hover:flex': !canGoPrevious }"
          />
        </button>
      </li>

      <!-- Page Numbers -->
      <li
        v-for="page in paginationRange"
        :key="page"
        class="group"
        :class="{ active: page === meta.current_page }"
      >
        <span
          v-if="page === '...'"
          class="flex size-11 items-center justify-center font-semibold text-desa-dark-green"
        >
          ...
        </span>

        <button
          v-else
          @click="goToPage(page)"
          class="flex size-11 items-center justify-center rounded-full bg-desa-foreshadow transition-setup group-hover:bg-desa-dark-green group-[.active]:bg-desa-dark-green"
        >
          <span
            class="font-semibold text-desa-dark-green group-hover:text-desa-foreshadow group-[.active]:text-desa-foreshadow"
          >
            {{ page }}
          </span>
        </button>
      </li>

      <!-- Next -->
      <li class="group">
        <button
          @click="nextPage"
          :disabled="!canGoNext"
          class="flex size-11 items-center justify-center rounded-full bg-desa-foreshadow transition-setup disabled:cursor-not-allowed enabled:hover:bg-desa-dark-green"
        >
          <img
            src="@/assets/images/icons/arrow-left-dark-green.svg"
            class="size-6 rotate-180"
            :class="{ 'group-hover:hidden': !canGoNext }"
          />
          <img
            src="@/assets/images/icons/arrow-left-foreshadow.svg"
            class="hidden size-6 rotate-180"
            :class="{ 'group-hover:flex': !canGoNext }"
          />
        </button>
      </li>
    </ul>

    <p class="mt-3 text-center text-sm text-desa-secondary">
      Menampilkan {{ meta.from || 0 }} - {{ meta.to || 0 }} dari
      {{ meta.total || 0 }} data
    </p>
  </nav>
</template>
