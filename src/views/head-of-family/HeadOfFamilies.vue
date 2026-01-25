<!-- src/views/head-of-family/HeadOfFamilies.vue -->
<script setup>
import { useHeadOfFamilyStore } from "@/stores/headOfFamily";
import { storeToRefs } from "pinia";
import { onMounted, onBeforeUnmount, ref, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import CardList from "@/components/head-of-family/CardList.vue";
import Pagination from "@/components/ui/Pagination.vue";
import { debounce } from "lodash";
import { ROUTE_NAMES } from "@/config/routes.config";

const router = useRouter();
const route = useRoute();
const headOfFamilyStore = useHeadOfFamilyStore();

const { headOfFamilies, meta, loading, error } = storeToRefs(headOfFamilyStore);
const { fetchHeadOfFamiliesPaginated } = headOfFamilyStore;

// ✅ Initialize dari URL query params
const serverOptions = ref({
  page: parseInt(route.query.page) || 1,
  row_per_page: parseInt(route.query.per_page) || 10,
});

const filters = ref({
  search: route.query.search || "",
});

// ✅ Computed untuk params yang bersih (tidak perlu di-watch)
const cleanedParams = computed(() => {
  const params = {
    page: serverOptions.value.page,
    row_per_page: serverOptions.value.row_per_page,
  };

  if (filters.value.search?.trim()) {
    params.search = filters.value.search.trim();
  }

  return params;
});

// ✅ Sync URL dengan state (tanpa trigger fetch)
const syncUrlWithState = () => {
  const query = {
    page: serverOptions.value.page,
    per_page: serverOptions.value.row_per_page,
  };

  if (filters.value.search?.trim()) {
    query.search = filters.value.search.trim();
  }

  // Replace agar tidak menambah history
  router.replace({ query });
};

// ✅ Fetch data dengan URL sync
const fetchData = async () => {
  syncUrlWithState();
  await fetchHeadOfFamiliesPaginated(cleanedParams.value);
};

// ✅ Debounce hanya untuk search
const debouncedFetchData = debounce(fetchData, 500);

// ✅ Cleanup debounce untuk mencegah memory leak
onBeforeUnmount(() => {
  debouncedFetchData.cancel();
});

// ✅ Initial fetch
onMounted(() => {
  fetchData();
});

// ✅ Watch pagination - langsung fetch (no debounce)
watch(
  () => serverOptions.value.page,
  (newPage, oldPage) => {
    if (newPage !== oldPage) {
      fetchData();
    }
  }
);

// ✅ Watch row_per_page - reset page + fetch
watch(
  () => serverOptions.value.row_per_page,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      serverOptions.value.page = 1;
      fetchData();
    }
  }
);

// ✅ Watch search - debounced + reset page
watch(
  () => filters.value.search,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      serverOptions.value.page = 1;
      debouncedFetchData();
    }
  }
);

// ✅ Computed untuk empty state message
const emptyStateMessage = computed(() => {
  return filters.value.search
    ? "Tidak ada hasil pencarian"
    : "Belum ada data kepala rumah";
});

const emptyStateDescription = computed(() => {
  return filters.value.search ? "Coba kata kunci lain atau hapus filter" : null;
});
</script>

<template>
  <div id="Header" class="flex items-center justify-between mb-6">
    <h1 class="font-semibold text-2xl">Kepala Rumah</h1>
    <RouterLink
      :to="{ name: ROUTE_NAMES.CREATE_HEAD_OF_FAMILY }"
      class="flex items-center rounded-2xl py-4 px-6 gap-[10px] bg-desa-dark-green hover:bg-desa-dark-green/90 transition-colors"
    >
      <img
        src="@/assets/images/icons/add-square-white.svg"
        class="flex size-6 shrink-0"
        alt="icon"
      />
      <p class="font-medium text-white">Add New</p>
    </RouterLink>
  </div>

  <section id="List-Kepala-Rumah" class="flex flex-col gap-[14px]">
    <!-- Search & Filter Form -->
    <form
      id="Page-Search"
      class="flex items-center justify-between"
      @submit.prevent
    >
      <div class="flex flex-col gap-3 w-[370px] shrink-0">
        <label class="relative group w-full">
          <input
            v-model="filters.search"
            type="text"
            placeholder="Cari nama Kepala Rumah atau NIK"
            class="appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 pl-12 pr-6 font-medium placeholder:text-desa-secondary transition-all duration-300"
          />
          <div
            class="absolute transform -translate-y-1/2 top-1/2 left-4 flex size-6 shrink-0"
          >
            <img
              src="@/assets/images/icons/user-search-secondary-green.svg"
              class="size-6 hidden group-has-[:placeholder-shown]:flex"
              alt="icon"
            />
            <img
              src="@/assets/images/icons/user-search-black.svg"
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
              v-model.number="serverOptions.row_per_page"
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
          class="flex items-center gap-1 h-14 w-fit rounded-2xl border border-desa-background bg-white py-4 px-6 hover:bg-gray-50 transition-colors"
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
    <template v-else-if="headOfFamilies?.length > 0">
      <CardList
        v-for="headOfFamily in headOfFamilies"
        :key="headOfFamily.id"
        :item="headOfFamily"
      />

      <!-- Pagination Component -->
      <Pagination
        v-if="meta.total > 0"
        :meta="meta"
        :current-page="serverOptions.page"
        class="mt-4"
        @update:page="serverOptions.page = $event"
      />
    </template>

    <!-- Empty State -->
    <div v-else class="flex justify-center py-12">
      <div class="flex flex-col items-center gap-3">
        <img
          src="@/assets/images/icons/user-search-secondary-green.svg"
          class="size-16 opacity-50"
          alt="icon"
        />
        <p class="text-desa-secondary font-medium">
          {{ emptyStateMessage }}
        </p>
        <p v-if="emptyStateDescription" class="text-desa-secondary text-sm">
          {{ emptyStateDescription }}
        </p>
      </div>
    </div>
  </section>
</template>
