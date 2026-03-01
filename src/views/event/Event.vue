<!-- src/views/event/Event.vue -->
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";

import ErrorState from "@/components/ui/state/ErrorState.vue";
import LoadingState from "@/components/ui/state/LoadingState.vue";
import { useDevelopment } from "@/composables/development/useDevelopment";
import { formatDate, formatRupiah } from "@/helpers/format";
import { ROUTE_NAMES } from "@/config/routes.config";
import type { DevelopmentStatus } from "@/types/development.type";
import { useDeleteDevelopment } from "@/composables/development/useDeleteDevelopment";
import ModalDelete from "@/components/ui/ModalDelete.vue";

import { useEvent } from "@/composables/event/useEvent";

const DEFAULT_THUMBNAIL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

/* =========================================================
 * ROUTE
 * ========================================================= */
const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id as string);

/* =========================================================
 * SERVER STATE
 * ========================================================= */
const { event, isPending, isFetching, isError, error, refetch } = useEvent(id);
</script>
<template>
  <div id="Header" class="flex items-center justify-between">
    <div class="flex flex-col gap-2">
      <div class="flex gap-1 items-center leading-5 text-desa-secondary">
        <RouterLink
          :to="{ name: ROUTE_NAMES.EVENT }"
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Events desa
        </RouterLink>
        <span aria-hidden="true">/</span>
        <p
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Detail Event Desa
        </p>
      </div>
      <h1 class="font-semibold text-2xl">Detail Event Desa</h1>
    </div>
    <a
      href="kd-event-desa-edit.html"
      class="flex items-center rounded-2xl py-4 px-6 gap-[10px] bg-desa-black"
    >
      <p class="font-medium text-white">Ubah Data</p>
      <img
        src="@/assets/images/icons/edit-white.svg"
        class="flex size-6 shrink-0"
        alt="icon"
      />
    </a>
  </div>

  <LoadingState v-if="isPending" label="Memuat detail pembangunan desa..." />
  <!-- <LoadingState v-else-if="isFetching" label="Memperbarui detail..." /> -->
  <ErrorState
    v-else-if="isError && error"
    :message="error.message"
    @retry="refetch"
  />

  <div v-else-if="event" class="flex gap-[14px]">
    <section
      id="Informasi"
      class="flex flex-col shrink-0 w-[calc(525/1000*100%)] h-fit rounded-3xl p-6 gap-6 bg-white"
    >
      <p class="font-medium leading-5 text-desa-secondary">Informasi Event</p>
      <div class="flex items-center w-full">
        <div
          class="flex w-[100px] h-20 shrink-0 rounded-2xl overflow-hidden bg-desa-foreshadow"
        >
          <img
            :src="event.thumbnail || DEFAULT_THUMBNAIL"
            class="w-full h-full object-cover"
            alt="Thumbnail event"
          />
        </div>
        <div class="flex flex-col gap-[6px] w-full ml-4 mr-9">
          <p class="font-semibold text-lg leading-[22.5px] line-clamp-1">
            {{ event.name }}
          </p>
          <div class="flex items-center gap-1">
            <img
              src="@/assets/images/icons/ticket-secondary-green.svg"
              class="flex size-[18px] shrink-0"
              alt="icon"
            />
            <p class="font-medium text-sm text-desa-secondary">
              Registration:
              <span
                class="font-medium text-base text-desa-dark-green"
                v-if="event.is_active"
              >
                Open
              </span>
              <span class="font-medium text-base text-desa-dark-red" v-else>
                Closed
              </span>
            </p>
          </div>
        </div>
      </div>
      <hr class="border-desa-foreshadow" />
      <div class="flex items-center w-full gap-3">
        <div
          class="flex size-[52px] shrink-0 rounded-2xl bg-desa-red/10 items-center justify-center"
        >
          <img
            src="@/assets/images/icons/ticket-2-red.svg"
            class="flex size-6 shrink-0"
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p class="font-semibold text-lg leading-[22.5px] text-desa-red">
            {{ formatRupiah(event.price) }}
          </p>
          <span class="font-medium text-desa-secondary"> Harga Event </span>
        </div>
      </div>
      <hr class="border-desa-foreshadow" />
      <div class="flex items-center w-full gap-3">
        <div
          class="flex size-[52px] shrink-0 rounded-2xl bg-desa-blue/10 items-center justify-center"
        >
          <img
            src="@/assets/images/icons/profile-2user-blue.svg"
            class="flex size-6 shrink-0"
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p class="font-semibold text-lg leading-[22.5px] text-desa-blue">
            {{ event.event_participants_count || 0 }} Warga
          </p>
          <span class="font-medium text-desa-secondary">
            Total Partisipasi
          </span>
        </div>
      </div>
      <hr class="border-desa-foreshadow" />
      <div class="flex items-center w-full gap-3">
        <div
          class="flex size-[52px] shrink-0 rounded-2xl bg-desa-foreshadow items-center justify-center"
        >
          <img
            src="@/assets/images/icons/calendar-2-dark-green.svg"
            class="flex size-6 shrink-0"
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p
            class="font-semibold text-lg leading-[22.5px] text-desa-dark-green"
          >
            {{ formatDate(event.date) }}
          </p>
          <span class="font-medium text-desa-secondary">
            Tanggal Pelaksaaan
          </span>
        </div>
      </div>
      <hr class="border-desa-foreshadow" />
      <div class="flex items-center w-full gap-3">
        <div
          class="flex size-[52px] shrink-0 rounded-2xl bg-desa-yellow/10 items-center justify-center"
        >
          <img
            src="@/assets/images/icons/clock-yellow.svg"
            class="flex size-6 shrink-0"
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p class="font-semibold text-lg leading-[22.5px] text-desa-yellow">
            {{ event.time }} WIB
          </p>
          <span class="font-medium text-desa-secondary">
            Tanggal Pelaksaaan
          </span>
        </div>
      </div>
      <hr class="border-desa-foreshadow" />
      <div class="flex flex-col gap-3">
        <p class="font-medium text-sm text-desa-secondary">Tentang Event</p>
        <p class="font-medium leading-8">
          {{ event.description }}
        </p>
      </div>
    </section>
    <section
      id="Participants"
      class="flex flex-col flex-1 h-fit shrink-0 rounded-3xl p-6 gap-6 bg-white"
    >
      <p class="font-medium leading-5 text-desa-secondary">
        Latest Participants
      </p>
      <div class="flex flex-col gap-[14px]">
        <template v-for="participant in event.event_participants">
          <div class="flex items-center gap-3 w-[302px] shrink-0">
            <div
              class="flex size-[54px] rounded-full bg-desa-foreshadow overflow-hidden"
            >
              <img
                :src="
                  participant.head_of_family?.profile_picture ||
                  DEFAULT_THUMBNAIL
                "
                class="w-full h-full object-cover"
                alt="icon"
              />
            </div>
            <div class="flex flex-col gap-1">
              <p class="font-semibold text-lg leading-5 text-desa-black">
                {{ participant.head_of_family?.user.name }}
              </p>
              <p class="flex items-center gap-1">
                <img
                  src="@/assets/images/icons/briefcase-secondary-green.svg"
                  class="flex size-[18px] shrink-0"
                  alt="icon"
                />
                <span class="font-medium text-sm text-desa-secondary">{{
                  participant.head_of_family?.occupation
                }}</span>
              </p>
            </div>
          </div>
        </template>
        <hr class="border-desa-background" />
      </div>
      <a
        href="#"
        class="flex items-center justify-center h-14 rounded-2xl py-4 px-6 gap-[10px] bg-desa-dark-green"
      >
        <span class="font-medium leading-5 text-white">View All</span>
      </a>
    </section>
  </div>
</template>
