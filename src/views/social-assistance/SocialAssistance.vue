<!-- src/views/social-assistance/SocialAssistanceDetail.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

import ModalDelete from "@/components/ui/ModalDelete.vue";
import ErrorState from "@/components/ui/state/ErrorState.vue";
import LoadingState from "@/components/ui/state/LoadingState.vue";

import { useSocialAssistance } from "@/composables/social-assistances/useSocialAssistance";
import { useDeleteSocialAssistance } from "@/composables/social-assistances/useDeleteSocialAssistance";

import { ROUTE_NAMES } from "@/config/routes.config";
import { formatRupiah, formatToClientTimezone } from "@/helpers/format";
import type { SocialAssistanceRecipient } from "@/types/socialAssistanceRecipient.type";

/* =========================================================
 * STATIC CONFIG
 * ========================================================= */
const DEFAULT_THUMBNAIL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

/* =========================================================
 * STATUS BADGE MAP — hapus 3x v-if duplikat
 * ========================================================= */
const RECIPIENT_STATUS_BADGE: Record<string, { label: string; class: string }> =
  {
    pending: { label: "Menunggu", class: "bg-desa-yellow" },
    approved: { label: "Disetujui", class: "bg-desa-green" },
    rejected: { label: "Ditolak", class: "bg-desa-red" },
  };

/* =========================================================
 * ROUTE
 * ========================================================= */
const route = useRoute();
const socialAssistanceId = computed(() => route.params.id as string);

/* =========================================================
 * SERVER STATE
 * ========================================================= */
const { socialAssistance, isPending, isFetching, error, isError, refetch } =
  useSocialAssistance(socialAssistanceId);

/* =========================================================
 * AVAILABILITY BADGE
 * ========================================================= */
const availabilityBadge = computed(() =>
  socialAssistance.value?.is_available
    ? { label: "Tersedia", class: "bg-desa-soft-green" }
    : { label: "Tidak Tersedia", class: "bg-desa-red" },
);

/* =========================================================
 * RECIPIENT LIMIT — View All tanpa tab
 * ========================================================= */
const RECIPIENT_LIMIT = 5;
const showAllRecipients = ref(false);

const allRecipients = computed<SocialAssistanceRecipient[]>(
  () => socialAssistance.value?.social_assistance_recipients ?? [],
);

const visibleRecipients = computed(() =>
  showAllRecipients.value
    ? allRecipients.value
    : allRecipients.value.slice(0, RECIPIENT_LIMIT),
);

const hasMoreRecipients = computed(
  () => allRecipients.value.length > RECIPIENT_LIMIT,
);

const remainingRecipientsCount = computed(
  () => allRecipients.value.length - RECIPIENT_LIMIT,
);

/* =========================================================
 * DELETE
 * ========================================================= */
const isDeleteModalOpen = ref(false);
const { deleteSocialAssistance, isDeleting } = useDeleteSocialAssistance();

async function confirmDelete() {
  await deleteSocialAssistance(socialAssistanceId.value);
  isDeleteModalOpen.value = false;
}
</script>

<template>
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-2">
      <nav class="flex gap-1 items-center leading-5 text-desa-secondary">
        <RouterLink
          :to="{ name: ROUTE_NAMES.SOCIAL_ASSISTANCE }"
          class="hover:text-desa-dark-green transition-colors capitalize"
        >
          Bantuan sosial
        </RouterLink>
        <span aria-hidden="true">/</span>
        <span class="text-desa-dark-green font-semibold capitalize">
          Manage bantuan sosial
        </span>
      </nav>
      <h1 class="font-semibold text-2xl">Manage Bantuan Sosial</h1>
    </div>

    <div class="flex items-center gap-3">
      <button
        type="button"
        class="flex items-center rounded-2xl py-4 px-6 gap-[10px] bg-desa-red"
        @click="isDeleteModalOpen = true"
      >
        <span class="font-medium text-white">Hapus Data</span>
        <img
          src="@/assets/images/icons/trash-white.svg"
          class="flex size-6 shrink-0"
          alt=""
          aria-hidden="true"
        />
      </button>
      <RouterLink
        :to="{
          name: ROUTE_NAMES.EDIT_SOCIAL_ASSISTANCE,
          params: { id: socialAssistanceId },
        }"
        class="flex items-center rounded-2xl py-4 px-6 gap-[10px] bg-desa-black"
      >
        <span class="font-medium text-white">Ubah Data</span>
        <img
          src="@/assets/images/icons/edit-white.svg"
          class="flex size-6 shrink-0"
          alt=""
          aria-hidden="true"
        />
      </RouterLink>
    </div>
  </div>

  <LoadingState v-if="isPending" label="Memuat detail bantuan sosial..." />
  <LoadingState v-else-if="isFetching" label="Memperbarui detail..." />
  <ErrorState
    v-else-if="isError && error"
    :message="error.message"
    @retry="refetch"
  />

  <div v-else-if="socialAssistance" class="flex gap-[14px]">
    <!-- Informasi Bantuan Sosial -->
    <section
      class="flex flex-col shrink-0 w-[calc(545/1000*100%)] h-fit rounded-3xl p-6 gap-6 bg-white"
    >
      <p class="font-medium leading-5 text-desa-secondary">
        Informasi Bantuan Sosial
      </p>

      <div class="flex items-center justify-between gap-4">
        <div
          class="flex w-[120px] h-[100px] shrink-0 rounded-2xl overflow-hidden bg-desa-foreshadow"
        >
          <img
            :src="socialAssistance.thumbnail || DEFAULT_THUMBNAIL"
            class="w-full h-full object-cover"
            alt="Thumbnail bantuan sosial"
          />
        </div>

        <!-- Fix: hapus 2x v-if → pakai availabilityBadge computed -->
        <div
          class="badge rounded-full p-3 gap-2 flex justify-center shrink-0"
          :class="availabilityBadge.class"
        >
          <span class="font-semibold text-xs text-white uppercase">
            {{ availabilityBadge.label }}
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-[6px] w-full">
        <p class="font-semibold text-xl">{{ socialAssistance.name }}</p>
        <p class="flex items-center gap-1">
          <img
            src="@/assets/images/icons/profile-secondary-green.svg"
            class="flex size-[18px] shrink-0"
            alt=""
            aria-hidden="true"
          />
          <span class="font-medium text-sm text-desa-secondary">
            {{ socialAssistance.provider }}
          </span>
        </p>
      </div>

      <hr class="border-desa-foreshadow" />

      <div class="flex items-center w-full gap-3">
        <div
          class="flex size-[52px] shrink-0 rounded-2xl bg-desa-foreshadow items-center justify-center"
        >
          <img
            src="@/assets/images/icons/money-dark-green.svg"
            class="flex size-6 shrink-0"
            alt=""
            aria-hidden="true"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <!-- Fix: hapus titik setelah Rp -->
          <p
            class="font-semibold text-lg leading-[22.5px] text-desa-dark-green"
          >
            Rp{{ formatRupiah(socialAssistance.amount) }}
          </p>
          <span class="font-medium text-desa-secondary">Uang Tunai</span>
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
            alt=""
            aria-hidden="true"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p class="font-semibold text-lg leading-[22.5px] text-desa-blue">
            {{ socialAssistance.social_assistance_recipients_count ?? 0 }} Warga
          </p>
          <span class="font-medium text-desa-secondary">Total Pengajuan</span>
        </div>
      </div>

      <hr class="border-desa-foreshadow" />

      <div class="flex flex-col gap-3">
        <p class="font-medium text-sm text-desa-secondary">Tentang Bantuan</p>
        <p class="font-medium leading-8">{{ socialAssistance.description }}</p>
      </div>
    </section>

    <!-- Penerima Bansos -->
    <section
      class="flex flex-col flex-1 h-fit shrink-0 rounded-3xl p-6 gap-6 bg-white"
    >
      <div class="flex items-center justify-between">
        <p class="font-medium leading-5 text-desa-secondary">
          Penerima Bansos Terakhir
        </p>
        <!-- Counter total -->
        <span class="font-medium text-sm text-desa-secondary">
          {{ allRecipients.length }} total
        </span>
      </div>

      <div class="flex flex-col gap-6">
        <div
          v-for="recipient in visibleRecipients"
          :key="recipient.id"
          class="card flex flex-col rounded-2xl border border-desa-background p-4 gap-4"
        >
          <div class="flex items-center justify-between">
            <p class="font-medium text-sm text-desa-secondary">
              {{ formatToClientTimezone(recipient.created_at) }}
            </p>
            <img
              src="@/assets/images/icons/calendar-2-secondary-green.svg"
              class="flex size-[18px] shrink-0"
              alt=""
              aria-hidden="true"
            />
          </div>

          <hr class="border-desa-background" />

          <div class="flex items-center gap-3">
            <div class="flex flex-col gap-[6px] w-full">
              <p class="font-semibold text-lg leading-5">
                Rp{{ formatRupiah(recipient.amount) }}
              </p>
              <p class="font-medium text-sm text-desa-secondary">
                Nominal Pengajuan
              </p>
            </div>

            <!-- Fix: hapus 3x v-if → pakai RECIPIENT_STATUS_BADGE map -->
            <div
              class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0"
              :class="RECIPIENT_STATUS_BADGE[recipient.status]?.class"
            >
              <span class="font-semibold text-xs text-white uppercase">
                {{ RECIPIENT_STATUS_BADGE[recipient.status]?.label }}
              </span>
            </div>
          </div>

          <hr class="border-desa-background" />

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-0.5">
              <img
                src="@/assets/images/icons/profile-secondary-green.svg"
                class="flex size-[18px] shrink-0"
                alt=""
                aria-hidden="true"
              />
              <p class="font-medium text-sm text-desa-secondary">
                Diberikan Kepada:
              </p>
            </div>
            <div class="flex items-center gap-1">
              <p class="font-medium leading-5">
                {{ recipient.head_of_family.user?.name }}
              </p>
              <div
                class="flex size-8 shrink-0 rounded-full bg-desa-foreshadow overflow-hidden"
              >
                <img
                  :src="
                    recipient.head_of_family?.profile_picture ||
                    DEFAULT_THUMBNAIL
                  "
                  class="w-full h-full object-cover"
                  alt="Foto penerima"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- View All / Sembunyikan — muncul hanya jika > RECIPIENT_LIMIT -->
        <button
          v-if="hasMoreRecipients || showAllRecipients"
          type="button"
          class="flex items-center justify-center h-14 rounded-2xl py-4 px-6 gap-[10px] bg-desa-dark-green transition-all duration-300"
          @click="showAllRecipients = !showAllRecipients"
        >
          <span class="font-medium leading-5 text-white">
            {{
              showAllRecipients
                ? "Sembunyikan"
                : `Lihat Semua (${remainingRecipientsCount} lainnya)`
            }}
          </span>
        </button>

        <!-- Empty state -->
        <div
          v-if="allRecipients.length === 0"
          class="flex justify-center py-12 text-desa-secondary font-medium"
        >
          Belum ada penerima bantuan sosial
        </div>
      </div>
    </section>
  </div>

  <ModalDelete
    v-model="isDeleteModalOpen"
    title="Hapus Bantuan Sosial?"
    description="Tindakan ini permanen dan tidak bisa dibatalkan!"
    :loading="isDeleting"
    confirm-text="Iya Hapus"
    @confirm="confirmDelete"
  />
</template>
