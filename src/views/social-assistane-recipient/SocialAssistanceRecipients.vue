<!-- src/views/social-assistance-recipient/SocialAssistanceRecipients.vue -->
<script setup lang="ts">
import CardList from "@/components/social-assistance-recipient/CardList.vue";
import Paginate from "@/components/ui/Paginate.vue";
import { useSocialAssistanceRecipients } from "@/composables/social-assistance-recipients/useSocialAssistanceRecipients";

const {
  data: recipients,
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
} = useSocialAssistanceRecipients();

const handleRefetch = () => refetch();
</script>
<template>
  <div id="Header" class="flex items-center justify-between">
    <h1 class="font-semibold text-2xl">Pengajuan Bantuan Sosial</h1>
  </div>

  <section id="List-pengajuan-Bansos" class="relative flex flex-col gap-[14px]">
    <!-- SEARCH + OPTIONS -->
    <form id="Page-Search" class="flex items-center justify-between">
      <div class="flex flex-col gap-3 w-[370px] shrink-0">
        <label class="relative group peer w-full valid">
          <input
            v-model="search"
            placeholder="Cari nama Pengajuan bantuan social"
            class="appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 pl-12 pr-6 gap-2 font-medium placeholder:text-desa-secondary transition-all duration-300"
          />
          <div
            class="absolute transform -translate-y-1/2 top-1/2 left-4 flex size-6 shrink-0"
          >
            <img
              src="@/assets/images/icons/user-search-secondary-green.svg"
              class="size-6 hidden group-has-[:placeholder-shown]:flex"
              alt=""
            />
            <img
              src="@/assets/images/icons/user-search-black.svg"
              class="size-6 flex group-has-[:placeholder-shown]:hidden"
              alt=""
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
              <option :value="5">5 Entries</option>
              <option :value="10">10 Entries</option>
              <option :value="20">20 Entries</option>
              <option :value="30">30 Entries</option>
              <option :value="40">40 Entries</option>
              <option :value="50">50 Entries</option>
            </select>
            <img
              src="@/assets/images/icons/arrow-down-black.svg"
              class="absolute top-1/2 right-6 -translate-y-1/2 size-6"
              alt=""
            />
          </div>
        </div>
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
        v-for="recipient in recipients"
        :key="recipient.id"
        :item="recipient"
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
