<!-- src/components/ui/Paginate.vue -->
<script setup lang="ts">
import { computed } from "vue";
import type { PaginationMeta } from "@/types/api";

/* ================= PROPS ================= */
const props = defineProps<{
  meta: PaginationMeta | null;
  page: number;
  delta?: number;
}>();

const emit = defineEmits<{
  (e: "update:page", value: number): void;
}>();

/* ================= CONST ================= */
const ELLIPSIS = "...";

/* ================= DERIVED ================= */
const currentPage = computed(() => props.page);
const delta = computed(() => props.delta ?? 1);

const lastPage = computed(() => props.meta?.last_page ?? 1);

const canGoPrevious = computed(() => currentPage.value > 1);
const canGoNext = computed(() => currentPage.value < lastPage.value);

/**
 * Pagination range generator (SAFE)
 */
const paginationRange = computed<(number | string)[]>(() => {
  if (!props.meta || lastPage.value <= 1) return [];

  const total = lastPage.value;
  const current = currentPage.value;

  const range: (number | string)[] = [];
  const left = Math.max(2, current - delta.value);
  const right = Math.min(total - 1, current + delta.value);

  range.push(1);

  if (left > 2) range.push(ELLIPSIS);

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) range.push(ELLIPSIS);

  range.push(total);

  return range;
});

/* ================= ACTIONS ================= */
function goToPage(page: number | string) {
  if (typeof page !== "number") return;

  if (page >= 1 && page <= lastPage.value && page !== currentPage.value) {
    emit("update:page", page);
  }
}

function previousPage() {
  if (canGoPrevious.value) {
    emit("update:page", currentPage.value - 1);
  }
}

function nextPage() {
  if (canGoNext.value) {
    emit("update:page", currentPage.value + 1);
  }
}
</script>

<template>
  <nav v-if="meta && meta.last_page > 1" id="Pagination">
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
