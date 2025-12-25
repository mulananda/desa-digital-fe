<!-- src/views/head-of-family/HeadOfFamilies.vue -->
<script setup>
import { useHeadOfFamilyStore } from "@/stores/headOfFamily";
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted, ref, watch, computed } from "vue";
import CardList from "@/components/head-of-family/CardList.vue";
import Pagination from "@/components/ui/Pagination.vue";
import { debounce } from "lodash";

const headOfFamilyStore = useHeadOfFamilyStore();

const { headOfFamilies, meta, loading, error } = storeToRefs(headOfFamilyStore);

const { fetchHeadOfFamiliesPaginated } = headOfFamilyStore;

const serverOptions = ref({
  page: 1,
  row_per_page: 10,
});

const filters = ref({
  search: "",
});

// ✅ Computed untuk filter params yang bersih (tidak kirim empty string)
const cleanedParams = computed(() => {
  const params = { ...serverOptions.value };

  if (filters.value.search && filters.value.search.trim()) {
    params.search = filters.value.search.trim();
  }

  return params;
});

const fetchData = async () => {
  await fetchHeadOfFamiliesPaginated(cleanedParams.value);
};

// ✅ Debounce hanya dibuat sekali
const debounceFetchData = debounce(fetchData, 500);

onMounted(fetchData);

// ✅ Cancel debounce saat komponen unmount untuk mencegah memory leak
onUnmounted(() => {
  debounceFetchData.cancel();
});

// ✅ Watch untuk pagination (langsung fetch tanpa debounce)
watch(
  () => serverOptions.value.page,
  () => {
    fetchData();
  }
);

// ✅ Watch untuk row_per_page (reset page ke 1)
watch(
  () => serverOptions.value.row_per_page,
  () => {
    serverOptions.value.page = 1;
    fetchData();
  }
);

// ✅ Watch untuk search (debounced & reset page ke 1)
watch(
  () => filters.value.search,
  () => {
    serverOptions.value.page = 1;
    debounceFetchData();
  }
);
</script>

<template>
  <div id="Header" class="flex items-center justify-between mb-6">
    <h1 class="font-semibold text-2xl">Kepala Rumah</h1>
    <a
      href="kd-kepala-rumah-add.html"
      class="flex items-center rounded-2xl py-4 px-6 gap-[10px] bg-desa-dark-green hover:bg-desa-dark-green/90 transition-colors"
    >
      <img
        src="@/assets/images/icons/add-square-white.svg"
        class="flex size-6 shrink-0"
        alt="icon"
      />
      <p class="font-medium text-white">Add New</p>
    </a>
  </div>

  <section id="List-Kepala-Rumah" class="flex flex-col gap-[14px]">
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
            placeholder="Cari nama Kepala Rumah atau NIK"
            class="appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 pl-12 pr-6 gap-2 font-medium placeholder:text-desa-secondary transition-all duration-300"
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
              class="appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 px-6 pr-[52px] gap-2 font-medium placeholder:text-desa-secondary transition-all duration-300"
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
    <template v-else-if="headOfFamilies.length > 0">
      <CardList
        v-for="headOfFamily in headOfFamilies"
        :key="headOfFamily.id"
        :item="headOfFamily"
      />

      <!-- Pagination Component -->
      <Pagination
        :meta="meta"
        :server-options="serverOptions"
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
          {{
            filters.search
              ? "Tidak ada hasil pencarian"
              : "Belum ada data kepala rumah"
          }}
        </p>
        <p v-if="filters.search" class="text-desa-secondary text-sm">
          Coba kata kunci lain atau hapus filter
        </p>
      </div>
    </div>
  </section>
</template>
