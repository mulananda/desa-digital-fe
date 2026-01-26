<!-- src/components/ui/Pagination.vue -->
<script setup>
import { computed } from "vue";

const props = defineProps({
  meta: { type: Object, required: true },
  currentPage: { type: Number, required: true },
});

const emit = defineEmits(["update:page"]);

const ELLIPSIS = "...";

const lastPage = computed(() => props.meta.last_page);
const canGoPrevious = computed(() => props.currentPage > 1);
const canGoNext = computed(() => props.currentPage < lastPage.value);

/**
 * Smart pagination range
 */
const paginationRange = computed(() => {
  const total = lastPage.value;
  const current = props.currentPage;
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
    if (prev && page - prev > 1) acc.push(ELLIPSIS);
    acc.push(page);
    return acc;
  }, []);
});

const goToPage = (page) => {
  if (typeof page === "number" && page !== props.currentPage) {
    emit("update:page", page);
  }
};

const previousPage = () =>
  canGoPrevious.value && goToPage(props.currentPage - 1);

const nextPage = () => canGoNext.value && goToPage(props.currentPage + 1);
</script>

<template>
  <nav v-if="meta.last_page > 1" id="Pagination">
    <ul class="flex items-center gap-3">
      <!-- Previous Button -->
      <li>
        <button
          @click="previousPage"
          :disabled="!canGoPrevious"
          class="flex size-11 items-center justify-center rounded-full bg-desa-foreshadow transition-all disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:bg-desa-dark-green group"
          :aria-label="'Previous Page'"
        >
          <img
            src="@/assets/images/icons/arrow-left-dark-green.svg"
            class="size-6 group-enabled:group-hover:hidden"
            alt=""
          />
          <img
            src="@/assets/images/icons/arrow-left-foreshadow.svg"
            class="hidden size-6 group-enabled:group-hover:block"
            alt=""
          />
        </button>
      </li>

      <!-- Page Numbers -->
      <li
        v-for="(page, index) in paginationRange"
        :key="`page-${index}`"
        class="group"
        :class="{ active: page === currentPage }"
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
          :aria-label="`Go to page ${page}`"
          :aria-current="page === currentPage ? 'page' : undefined"
          class="flex size-11 items-center justify-center rounded-full bg-desa-foreshadow transition-setup group-hover:bg-desa-dark-green"
          :class="{
            'group-[.active]:bg-desa-dark-green': page === currentPage,
          }"
        >
          <span
            class="font-semibold text-desa-dark-green group-hover:text-desa-foreshadow"
            :class="{
              'group-[.active]:text-desa-foreshadow': page === currentPage,
            }"
          >
            {{ page }}
          </span>
        </button>
      </li>

      <li class="group">
        <button
          @click="nextPage"
          :disabled="!canGoNext"
          class="flex size-11 items-center justify-center rounded-full bg-desa-foreshadow transition-all disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:bg-desa-dark-green group"
          :aria-label="'Next Page'"
        >
          <img
            src="@/assets/images/icons/arrow-left-dark-green.svg"
            class="size-6 rotate-180 group-enabled:group-hover:hidden"
            alt="icon"
          />
          <img
            src="@/assets/images/icons/arrow-left-foreshadow.svg"
            class="hidden size-6 rotate-180 group-enabled:group-hover:block"
            alt="icon"
          />
        </button>
      </li>
    </ul>

    <!-- Info Text -->
    <p class="mt-3 text-center text-sm text-desa-secondary">
      Menampilkan {{ meta.from || 0 }} - {{ meta.to || 0 }} dari
      {{ meta.total || 0 }} data
    </p>
  </nav>
</template>
