<script setup>
import { ref, computed, watch, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { debounce } from "lodash";

import { useSocialAssistanceStore } from "@/stores/socialAssistance";
import CardList from "@/components/social-assistance/CardList.vue";
import Pagination from "@/components/ui/Pagination.vue";
import { ROUTE_NAMES } from "@/config/routes.config";

/* =====================
 * Setup
 * ===================== */
const router = useRouter();
const route = useRoute();
const store = useSocialAssistanceStore();
const { socialAssistances, meta, loading, error } = storeToRefs(store);

/* =====================
 * State
 * ===================== */
const pagination = ref({
  page: Number(route.query.page) || 1,
  perPage: Number(route.query.per_page) || 10,
});

const filters = ref({
  search: route.query.search || "",
});

/* =====================
 * Query Params Builder
 * ===================== */
const queryParams = computed(() => {
  const params = {
    page: Math.max(1, pagination.value.page),
    row_per_page: pagination.value.perPage,
  };

  if (filters.value.search?.trim()) {
    params.search = filters.value.search.trim();
  }

  return params;
});

/* =====================
 * URL Sync
 * ===================== */
const syncUrl = () => {
  router.replace({
    query: {
      page: pagination.value.page,
      per_page: pagination.value.perPage,
      ...(filters.value.search && { search: filters.value.search }),
    },
  });
};

/* =====================
 * Fetch Data
 * ===================== */
const fetchData = async () => {
  syncUrl();
  const result = await store.fetchSocialAssistancesPaginated(queryParams.value);

  if (
    result &&
    pagination.value.page > meta.value.last_page &&
    meta.value.last_page > 0
  ) {
    pagination.value.page = meta.value.last_page;
  }
};

/* =====================
 * Debounced Search
 * ===================== */
const debouncedSearch = debounce(() => {
  pagination.value.page = 1;
  fetchData();
}, 500);

/* =====================
 * Watchers
 * ===================== */
watch(() => [pagination.value.page, pagination.value.perPage], fetchData, {
  immediate: true,
});

watch(
  () => filters.value.search,
  () => debouncedSearch(),
);

/* =====================
 * Cleanup
 * ===================== */
onBeforeUnmount(() => {
  debouncedSearch.cancel();
  store.cancelOngoingRequest?.();
});

/* =====================
 * Delete Handler
 * ===================== */
// const handleDelete = async (id) => {
//   const success = await store.deleteHeadOfFamily(id);
//   if (!success) return;

//   const isLastItem = headOfFamilies.value.length === 0;
//   if (isLastItem && pagination.value.page > 1) {
//     pagination.value.page--;
//   } else {
//     fetchData();
//   }
// };

/* =====================
 * Empty State
 * ===================== */
const emptyStateConfig = computed(() => ({
  message: filters.value.search
    ? "Tidak ada hasil pencarian"
    : "Belum ada data kepala rumah",
  description: filters.value.search
    ? "Coba kata kunci lain atau hapus filter"
    : null,
  icon: "user-search-secondary-green.svg",
}));
</script>
<template>
  <div id="Header" class="flex items-center justify-between">
    <h1 class="font-semibold text-2xl">List Bantuan Sosial</h1>
    <a
      href="kd-bantuan-sosial-add.html"
      class="flex items-center rounded-2xl py-4 px-6 gap-[10px] bg-desa-dark-green"
    >
      <img
        src="@/assets/images/icons/add-square-white.svg"
        class="flex size-6 shrink-0"
        alt="icon"
      />
      <p class="font-medium text-white">Add New</p>
    </a>
  </div>
  <section id="List-Bantuan-Sosial" class="flex flex-col gap-[14px]">
    <form
      id="Page-Search"
      class="flex items-center justify-between"
      @submit.prevent
    >
      <div class="flex flex-col gap-3 w-[370px] shrink-0">
        <label class="relative group peer w-full valid">
          <input
            v-model="filters.search"
            type="text"
            placeholder="Cari nama bantuan social"
            class="appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 pl-12 pr-6 gap-2 font-medium placeholder:text-desa-secondary transition-all duration-300"
          />
          <div
            class="absolute transform -translate-y-1/2 top-1/2 left-4 flex size-6 shrink-0"
          >
            <img
              src="@/assets/images/icons/receipt-search-secondary-green.svg"
              class="size-6 hidden group-has-[:placeholder-shown]:flex"
              alt="icon"
            />
            <img
              src="@/assets/images/icons/receipt-search-black.svg"
              class="size-6 flex group-has-[:placeholder-shown]:hidden"
              alt="icon"
            />
          </div>
        </label>
      </div>
      <div class="options flex items-center gap-4">
        <div class="flex items-center gap-[10px]">
          <span class="font-medium leading-5">Show</span>
          <div class="relative">
            <select
              v-model.number="pagination.perPage"
              class="appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 px-6 pr-[52px] font-medium transition-all duration-300"
            >
              <option :value="5">5 Entries</option>
              <option :value="10">10 Entries</option>
              <option :value="20">20 Entries</option>
              <option :value="30">30 Entries</option>
              <option :value="40">40 Entries</option>
              <option :value="50">50 Entries</option>
            </select>
            <img
              src="@/assets/images/icons/arrow-down-black.svg"
              class="flex size-6 shrink-0 absolute transform -translate-y-1/2 top-1/2 right-6 pointer-events-none"
              alt="icon"
            />
          </div>
        </div>
        <button
          type="button"
          class="flex items-center gap-1 h-14 w-fit rounded-2xl border border-desa-background bg-white py-4 px-6"
        >
          <img
            src="@/assets/images/icons/filter-black.svg"
            class="flex size-6 shrink-0"
            alt="icon"
          />
          <span class="font-medium leading-5">Filter</span>
        </button>
      </div>
    </form>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="flex flex-col items-center gap-3">
        <div
          class="animate-spin rounded-full h-10 w-10 border-b-2 border-desa-dark-green"
        ></div>
        <p class="text-desa-secondary">Memuat data...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex justify-center py-12">
      <div class="flex flex-col items-center gap-3 max-w-md text-center">
        <div class="text-red-500 text-4xl mb-2">⚠️</div>
        <p class="text-red-500 font-medium">Terjadi kesalahan</p>
        <p class="text-desa-secondary text-sm">{{ error }}</p>
        <button
          @click="fetchData"
          class="px-4 py-2 bg-desa-dark-green text-white rounded-lg hover:bg-desa-dark-green/90 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
    <!-- Data List -->
    <template v-else-if="socialAssistances?.length > 0">
      <CardList
        v-for="socialAssistance in socialAssistances"
        :key="socialAssistance.id"
        :item="socialAssistance"
      />

      <!-- Pagination Component -->
      <Pagination
        v-if="meta.total > 0"
        :meta="meta"
        :current-page="pagination.page"
        class="mt-4"
        @update:page="pagination.page = $event"
      />
    </template>

    <!-- Empty State -->
    <div v-else class="flex justify-center py-12">
      <div class="flex flex-col items-center gap-3">
        <img
          :src="`@/assets/images/icons/${emptyStateConfig.icon}`"
          class="size-16 opacity-50"
          alt="icon"
        />
        <p class="text-desa-secondary font-medium">
          {{ emptyStateConfig.message }}
        </p>
        <p
          v-if="emptyStateConfig.description"
          class="text-desa-secondary text-sm"
        >
          {{ emptyStateConfig.description }}
        </p>
      </div>
    </div>
  </section>
</template>
