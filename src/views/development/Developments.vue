<!-- src/views/Development.vue -->
<script setup lang="ts">
import CardList from "@/components/development/CardList.vue";
import Paginate from "@/components/ui/Paginate.vue";
import { useDevelopments } from "@/composables/development/useDevelopments";

const {
  data: developments,
  meta,
  page,
  perPage,
  setPage,
  setPerPage,
  search,
  isLoading,
  isFetching,
  isError,
  error,
  isEmpty,
  refetch,
} = useDevelopments();

const handleRefetch = () => refetch();
</script>
<template>
  <div id="Header" class="flex items-center justify-between">
    <h1 class="font-semibold text-2xl">Pembangunan Desa</h1>
    <a
      href="kd-pembangunan-desa-add.html"
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
  <section id="List-Pembangunan-Desa" class="flex flex-col gap-[14px]">
    <form id="Page-Search" class="flex items-center justify-between">
      <div class="flex flex-col gap-3 w-[370px] shrink-0">
        <label class="relative group peer w-full valid">
          <input
            v-model="search"
            type="text"
            placeholder="Cari nama pembangunan desa"
            class="appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 pl-12 pr-6 gap-2 font-medium placeholder:text-desa-secondary transition-all duration-300"
          />
          <div
            class="absolute transform -translate-y-1/2 top-1/2 left-4 flex size-6 shrink-0"
          >
            <img
              src="@/assets/images/icons/box-search-secondary-green.svg"
              class="size-6 hidden group-has-[:placeholder-shown]:flex"
              alt="icon"
            />
            <img
              src="@/assets/images/icons/box-search-black.svg"
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
              :value="perPage"
              @change="
                setPerPage(
                  Number(($event.currentTarget as HTMLSelectElement).value),
                )
              "
              class="appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 px-6 pr-[52px] font-medium transition-all"
            >
              <option :value="5" selected>5 Entries</option>
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
    <!-- LOADING -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="flex flex-col items-center gap-3">
        <div
          class="animate-spin rounded-full h-10 w-10 border-b-2 border-desa-dark-green"
        ></div>
        <p class="text-desa-secondary">Memuat data...</p>
      </div>
    </div>
    <div v-if="isFetching && !isLoading" class="flex justify-center py-12">
      <div class="flex flex-col items-center gap-3">
        <div
          class="animate-spin rounded-full h-10 w-10 border-b-2 border-desa-dark-green"
        ></div>
        <p class="text-desa-secondary">Memperbarui data...</p>
      </div>
    </div>

    <!-- ERROR -->
    <div v-else-if="isError" class="flex justify-center py-12">
      <div class="flex flex-col items-center gap-3 max-w-md text-center">
        <div class="text-red-500 text-4xl mb-2">⚠️</div>
        <p class="text-red-500 font-medium">Terjadi kesalahan</p>
        <p class="text-desa-secondary text-sm">
          {{ error ?? "Gagal memuat data" }}
        </p>
        <button
          @click="handleRefetch"
          class="px-4 py-2 bg-desa-dark-green text-white rounded-lg"
        >
          Coba Lagi
        </button>
      </div>
    </div>

    <!-- EMPTY STATE -->
    <div v-else-if="isEmpty" class="flex justify-center py-12">
      <p class="text-sm font-medium text-desa-secondary">Data tidak tersedia</p>
    </div>

    <!-- DATA LIST -->
    <template v-else>
      <CardList
        v-for="development in developments"
        :key="development.id"
        :item="development"
      />

      <Paginate
        :meta="meta!"
        :page="page"
        @update:page="setPage"
        class="mt-4"
      />
    </template>
  </section>
</template>
