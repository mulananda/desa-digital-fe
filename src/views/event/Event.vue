<!-- src/views/event/Event.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import ErrorState from "@/components/ui/state/ErrorState.vue";
import LoadingState from "@/components/ui/state/LoadingState.vue";
import { formatDate, formatRupiah } from "@/helpers/format";
import { ROUTE_NAMES } from "@/config/routes.config";
import { useEvent } from "@/composables/event/useEvent";
import { ref } from "vue";

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
const { event, isPending, isError, error, refetch } = useEvent(id);

/* =========================================================
 * Participants
 * ========================================================= */
const showAllParticipants = ref(false);

const visibleParticipants = computed(() =>
  showAllParticipants.value
    ? event.value?.event_participants
    : event.value?.event_participants?.slice(0, 5),
);

const toggleLabel = computed(() =>
  showAllParticipants.value
    ? "Sembunyikan"
    : `View All (${event.value?.event_participants_count ?? 0})`,
);
</script>

<template>
  <div id="Header" class="flex items-center justify-between">
    <div class="flex flex-col gap-2">
      <div class="flex gap-1 items-center leading-5 text-desa-secondary">
        <RouterLink
          :to="{ name: ROUTE_NAMES.EVENT }"
          class="hover:text-desa-dark-green transition-colors capitalize"
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

    <!-- ✅ Gunakan RouterLink, bukan anchor tag statis -->
    <RouterLink
      :to="{ name: ROUTE_NAMES.EDIT_EVENT, params: { id } }"
      class="flex items-center rounded-2xl py-4 px-6 gap-[10px] bg-desa-black"
    >
      <p class="font-medium text-white">Ubah Data</p>
      <img
        src="@/assets/images/icons/edit-white.svg"
        class="flex size-6 shrink-0"
        alt="icon"
      />
    </RouterLink>
  </div>

  <LoadingState v-if="isPending" label="Memuat detail event desa..." />

  <ErrorState
    v-else-if="isError && error"
    :message="error.message"
    @retry="refetch"
  />

  <div v-else-if="event" class="flex gap-[14px]">
    <!-- ===== Informasi Event ===== -->
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
              alt=""
              aria-hidden="true"
            />
            <p class="font-medium text-sm text-desa-secondary">
              Registration:
              <span
                v-if="event.is_active"
                class="font-medium text-base text-desa-dark-green"
              >
                Open
              </span>
              <span v-else class="font-medium text-base text-desa-dark-red">
                Closed
              </span>
            </p>
          </div>
        </div>
      </div>

      <hr class="border-desa-foreshadow" />

      <!-- Harga -->
      <div class="flex items-center w-full gap-3">
        <div
          class="flex size-[52px] shrink-0 rounded-2xl bg-desa-red/10 items-center justify-center"
        >
          <img
            src="@/assets/images/icons/ticket-2-red.svg"
            class="flex size-6 shrink-0"
            alt=""
            aria-hidden="true"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p class="font-semibold text-lg leading-[22.5px] text-desa-red">
            {{ formatRupiah(event.price) }}
          </p>
          <span class="font-medium text-desa-secondary">Harga Event</span>
        </div>
      </div>

      <hr class="border-desa-foreshadow" />

      <!-- Partisipasi -->
      <div class="flex items-center w-full gap-3">
        <div
          class="flex size-[52px] shrink-0 rounded-2xl bg-desa-blue/10 items-center justify-center"
        >
          <img
            src="@/assets/images/icons/profile-2user-blue.svg"
            class="flex size-6 shrink-0"
            alt=""
            aria-hidden="true"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p class="font-semibold text-lg leading-[22.5px] text-desa-blue">
            {{ event.event_participants_count ?? 0 }} Warga
          </p>
          <span class="font-medium text-desa-secondary">Total Partisipasi</span>
        </div>
      </div>

      <hr class="border-desa-foreshadow" />

      <!-- Tanggal -->
      <div class="flex items-center w-full gap-3">
        <div
          class="flex size-[52px] shrink-0 rounded-2xl bg-desa-foreshadow items-center justify-center"
        >
          <img
            src="@/assets/images/icons/calendar-2-dark-green.svg"
            class="flex size-6 shrink-0"
            alt=""
            aria-hidden="true"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p
            class="font-semibold text-lg leading-[22.5px] text-desa-dark-green"
          >
            {{ formatDate(event.date) }}
          </p>
          <span class="font-medium text-desa-secondary"
            >Tanggal Pelaksanaan</span
          >
        </div>
      </div>

      <hr class="border-desa-foreshadow" />

      <!-- Waktu -->
      <div class="flex items-center w-full gap-3">
        <div
          class="flex size-[52px] shrink-0 rounded-2xl bg-desa-yellow/10 items-center justify-center"
        >
          <img
            src="@/assets/images/icons/clock-yellow.svg"
            class="flex size-6 shrink-0"
            alt=""
            aria-hidden="true"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p class="font-semibold text-lg leading-[22.5px] text-desa-yellow">
            {{ event.time }} WIB
          </p>
          <span class="font-medium text-desa-secondary">Waktu Pelaksanaan</span>
        </div>
      </div>

      <hr class="border-desa-foreshadow" />

      <!-- Deskripsi -->
      <div class="flex flex-col gap-3">
        <p class="font-medium text-sm text-desa-secondary">Tentang Event</p>
        <p class="font-medium leading-8">{{ event.description }}</p>
      </div>
    </section>

    <!-- Template section Participants -->
    <section
      id="Participants"
      class="flex flex-col flex-1 h-fit shrink-0 rounded-3xl p-6 gap-6 bg-white"
    >
      <p class="font-medium leading-5 text-desa-secondary">
        Latest Participants
      </p>

      <div class="flex flex-col gap-[14px]">
        <template
          v-for="participant in visibleParticipants"
          :key="participant.event_id"
        >
          <div class="flex items-center gap-3 w-full shrink-0">
            <div
              class="flex size-[54px] rounded-full bg-desa-foreshadow overflow-hidden shrink-0"
            >
              <img
                :src="
                  participant.head_of_family?.profile_picture ||
                  DEFAULT_THUMBNAIL
                "
                class="w-full h-full object-cover"
                :alt="participant.head_of_family?.user.name ?? 'Participant'"
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
                  alt=""
                  aria-hidden="true"
                />
                <span class="font-medium text-sm text-desa-secondary">
                  {{ participant.head_of_family?.occupation }}
                </span>
              </p>
            </div>
          </div>
          <hr class="border-desa-background" />
        </template>
      </div>

      <!-- Tombol hanya muncul jika data > 5 -->
      <button
        v-if="(event.event_participants_count ?? 0) > 5"
        type="button"
        class="flex items-center justify-center h-14 rounded-2xl py-4 px-6 gap-[10px] bg-desa-dark-green"
        @click="showAllParticipants = !showAllParticipants"
      >
        <span class="font-medium leading-5 text-white">
          {{ toggleLabel }}
        </span>
      </button>
    </section>
  </div>
</template>
