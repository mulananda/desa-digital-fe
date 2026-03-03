<script setup lang="ts">
import CardList from "@/components/event/CardList.vue";
import Paginate from "@/components/ui/Paginate.vue";
import EmptyState from "@/components/ui/state/EmptyState.vue";
import ErrorState from "@/components/ui/state/ErrorState.vue";
import LoadingState from "@/components/ui/state/LoadingState.vue";
import { useEvents } from "@/composables/event/useEvents";
import { ROUTE_NAMES } from "@/config/routes.config";
import { validateSearchInput } from "@/utils/sanitization";
import { watchDebounced } from "@vueuse/core";
import { ref } from "vue";

const {
  data: events,
  meta,
  page,
  perPage,
  search,
  setPage,
  setPerPage,
  isLoading,
  isFetching,
  isError,
  error,
  isEmpty,
  refetch,
  permissionError, // ✅ NEW
} = useEvents();

// ✅ NEW: Search validation state
const searchError = ref<string>("");

/* =====================
 * SEARCH VALIDATION
 * ===================== */
const handleSearchInput = (value: string) => {
  const validation = validateSearchInput(value);

  if (!validation.valid) {
    searchError.value = validation.error || "";
    search.value = "";
  } else {
    searchError.value = "";
    search.value = value;
  }
};

/* =====================
 * SEARCH DEBOUNCE
 * ===================== */
watchDebounced(
  search,
  () => {
    setPage(1);
  },
  { debounce: 400 },
);
</script>

<template>
  <!-- ✅ NEW: Permission check -->
  <div v-if="permissionError" class="text-red-500 text-center py-8">
    {{ permissionError }}
  </div>
  <div v-else>
    <div id="Header" class="flex items-center justify-between">
      <h1 class="font-semibold text-2xl">Events Desa</h1>
      <RouterLink
        :to="{ name: ROUTE_NAMES.CREATE_EVENT }"
        class="flex items-center rounded-2xl py-4 px-6 gap-[10px] bg-desa-dark-green"
      >
        <img
          src="@/assets/images/icons/add-square-white.svg"
          class="flex size-6 shrink-0"
          alt="icon"
        />
        <p class="font-medium text-white">Add New</p>
      </RouterLink>
    </div>
    <section class="flex flex-col gap-[14px]">
      <form id="Page-Search" class="flex items-center justify-between">
        <div class="flex flex-col gap-3 w-[370px] shrink-0">
          <label class="relative group peer w-full valid">
            <input
              @input="
                handleSearchInput(($event.target as HTMLInputElement).value)
              "
              type="text"
              placeholder="Cari nama event desa"
              class="appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 pl-12 pr-6 gap-2 font-medium placeholder:text-desa-secondary transition-all duration-300"
              :class="{ 'ring-red-500': searchError }"
            />
            <div
              class="absolute transform -translate-y-1/2 top-1/2 left-4 flex size-6 shrink-0"
            >
              <img
                src="@/assets/images/icons/calendar-search-secondary-green.svg"
                class="size-6 hidden group-has-[:placeholder-shown]:flex"
                alt="icon"
              />
              <img
                src="@/assets/images/icons/calendar-search-black.svg"
                class="size-6 flex group-has-[:placeholder-shown]:hidden"
                alt="icon"
              />
            </div>
          </label>
          <!-- ✅ NEW: Validation error message -->
          <span v-if="searchError" class="text-red-500 text-sm font-medium">
            {{ searchError }}
          </span>
        </div>

        <div class="options flex items-center gap-4">
          <div class="flex items-center gap-[10px]">
            <span class="font-medium leading-5">Show</span>
            <div class="relative">
              <select
                v-model.number="perPage"
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
                class="flex size-6 shrink-0 absolute transform -translate-y-1/2 top-1/2 right-6"
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
      <!-- STATES -->
      <LoadingState v-if="isLoading" label="Memuat data event..." />
      <!-- <LoadingState v-else-if="isFetching" label="Memperbarui data..." /> -->

      <ErrorState v-else-if="isError" :message="error" @retry="refetch" />

      <EmptyState v-else-if="isEmpty" label="Data tidak tersedia" />

      <!-- LIST -->
      <template v-else>
        <CardList v-for="item in events" :key="item.id" :item="item" />

        <Paginate
          v-if="meta"
          :meta="meta"
          :page="page"
          @update:page="setPage"
          class="mt-4"
        />
      </template>
    </section>
  </div>
</template>
