<!-- src/views/development/Development.vue -->
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

/* =========================================================
 * ROUTE
 * ========================================================= */
const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id as string);

/* =========================================================
 * SERVER STATE
 * ========================================================= */
const { development, isPending, isFetching, isError, error, refetch } =
  useDevelopment(id);

const { deleteDevelopment, isDeleting } = useDeleteDevelopment();

/* =========================================================
 * STATUS BADGE MAP
 * ========================================================= */
const STATUS_BADGE: Record<
  DevelopmentStatus,
  { label: string; class: string }
> = {
  ongoing: { label: "Sedang Berjalan", class: "bg-desa-yellow" },
  completed: { label: "Selesai", class: "bg-desa-green" },
};

const APPLICANT_STATUS_BADGE: Record<string, { label: string; class: string }> =
  {
    pending: { label: "Menunggu", class: "bg-desa-yellow" },
    approved: { label: "Diterima", class: "bg-desa-green" },
    rejected: { label: "Ditolak", class: "bg-desa-red" },
  };

const statusBadge = computed(() => {
  const status = development.value?.status ?? "ongoing";
  return STATUS_BADGE[status];
});

/* =========================================================
 * TAB FILTER
 * ========================================================= */
type ApplicantTab = "all" | "pending" | "approved" | "rejected";

const activeTab = ref<ApplicantTab>("all");

const TAB_OPTIONS: Array<{ value: ApplicantTab; label: string }> = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Menunggu" },
  { value: "approved", label: "Diterima" },
  { value: "rejected", label: "Ditolak" },
];

const filteredApplicants = computed(() => {
  const applicants = development.value?.development_applicants ?? [];
  if (activeTab.value === "all") return applicants;
  return applicants.filter((a) => a.status === activeTab.value);
});

/* =========================================================
 * APPLICANT LIMIT
 * ========================================================= */
const APPLICANT_LIMIT = 5;
const showAllApplicants = ref(false);

// Reset showAll saat tab berubah
watch(activeTab, () => {
  showAllApplicants.value = false;
});

const visibleApplicants = computed(() =>
  showAllApplicants.value
    ? filteredApplicants.value
    : filteredApplicants.value.slice(0, APPLICANT_LIMIT),
);

const hasMore = computed(
  () => filteredApplicants.value.length > APPLICANT_LIMIT,
);

const remainingCount = computed(
  () => filteredApplicants.value.length - APPLICANT_LIMIT,
);

/* =========================================================
 * COMPUTED
 * ========================================================= */
const durationDays = computed(() => {
  const dev = development.value;
  if (!dev?.start_date || !dev?.end_date) return 0;
  return dayjs(dev.end_date).diff(dayjs(dev.start_date), "day") + 1;
});

const DEFAULT_THUMBNAIL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

/* =========================================================
 * HANDLERS
 * ========================================================= */
function handleEdit() {
  router.push({ name: ROUTE_NAMES.DEVELOPMENT_EDIT, params: { id: id.value } });
}

const showModalDelete = ref(false);

async function handleDelete() {
  if (!id.value) return;
  try {
    await deleteDevelopment(id.value);

    showModalDelete.value = false;
  } catch {
    // kalau error → modal tetap terbuka (UX lebih benar)
  }
}
</script>

<template>
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-2">
      <nav class="flex gap-1 items-center leading-5 text-desa-secondary">
        <RouterLink
          :to="{ name: ROUTE_NAMES.DEVELOPMENT }"
          class="hover:text-desa-dark-green transition-colors capitalize"
        >
          Pembangunan Desa
        </RouterLink>
        <span aria-hidden="true">/</span>
        <span class="text-desa-dark-green font-semibold capitalize">
          Detail Pembangunan Desa
        </span>
      </nav>
      <h1 class="font-semibold text-2xl">Detail Pembangunan Desa</h1>
    </div>

    <div class="flex items-center gap-3">
      <button
        class="flex items-center rounded-2xl py-4 px-6 gap-[10px] bg-desa-red"
        @click="showModalDelete = true"
      >
        <p class="font-medium text-white">Hapus Data</p>
        <img
          src="@/assets/images/icons/trash-white.svg"
          class="flex size-6 shrink-0"
          alt="icon"
        />
      </button>
      <ModalDelete
        v-model="showModalDelete"
        title="Hapus Pembangunan?"
        description="Tindakan ini permanen dan tidak bisa dibatalkan!"
        :loading="isDeleting"
        confirm-text="Iya Hapus"
        @confirm="handleDelete"
      />
      <RouterLink
        :to="{
          name: ROUTE_NAMES.EDIT_DEVELOPMENT,
          params: { id: id },
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

  <LoadingState v-if="isPending" label="Memuat detail pembangunan desa..." />
  <!-- <LoadingState v-else-if="isFetching" label="Memperbarui detail..." /> -->
  <ErrorState
    v-else-if="isError && error"
    :message="error.message"
    @retry="refetch"
  />

  <div v-else-if="development" class="flex flex-col gap-[14px]">
    <!-- Informasi Pembangunan -->
    <section class="flex flex-col rounded-3xl p-6 gap-6 bg-white">
      <p class="font-medium leading-5 text-desa-secondary">
        Informasi Pembangunan
      </p>

      <div class="flex items-center justify-between">
        <div
          class="flex w-[120px] h-[100px] shrink-0 rounded-2xl overflow-hidden bg-desa-foreshadow"
        >
          <img
            :src="development.thumbnail || DEFAULT_THUMBNAIL"
            class="w-full h-full object-cover"
            alt="Thumbnail pembangunan"
          />
        </div>
        <div
          class="badge rounded-full p-3 gap-2 flex justify-center shrink-0"
          :class="statusBadge.class"
        >
          <span class="font-semibold text-xs text-white uppercase">
            {{ statusBadge.label }}
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-[6px] w-full">
        <p class="font-semibold text-lg leading-[22.5px] line-clamp-1">
          {{ development.name }}
        </p>
        <p class="font-medium text-sm text-desa-secondary">
          Penanggung Jawab:
          <span class="font-medium text-base text-desa-dark-green">
            {{ development.person_in_charge }}
          </span>
        </p>
      </div>

      <hr class="border-desa-foreshadow" />

      <div class="flex items-center justify-between">
        <div class="flex items-center w-full gap-3">
          <div
            class="flex size-[52px] shrink-0 rounded-2xl bg-desa-red/10 items-center justify-center"
          >
            <img
              src="@/assets/images/icons/wallet-3-red.svg"
              class="flex size-6 shrink-0"
              alt=""
              aria-hidden="true"
            />
          </div>
          <div class="flex flex-col gap-1 w-full">
            <p class="font-semibold text-xl leading-[22.5px] text-desa-red">
              Rp{{ formatRupiah(development.amount) }}
            </p>
            <span class="font-medium text-desa-secondary"
              >Dana Pembangunan</span
            >
          </div>
        </div>
        <!-- <div
          class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-dark-green"
        >
          <span class="font-semibold text-xs text-white uppercase"
            >Tersedia</span
          >
        </div> -->
      </div>

      <hr class="border-desa-foreshadow" />

      <div class="grid grid-cols-2 gap-3">
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
              class="font-semibold text-xl leading-[22.5px] text-desa-dark-green"
            >
              {{ formatDate(development.start_date) }}
            </p>
            <span class="font-medium text-desa-secondary"
              >Tanggal Pelaksanaan</span
            >
          </div>
        </div>
        <div class="flex items-center w-full gap-3 justify-end">
          <div class="flex flex-col gap-1 w-full text-right">
            <p
              class="font-semibold text-xl leading-[22.5px] text-desa-dark-green"
            >
              {{ formatDate(development.end_date) }}
            </p>
            <span class="font-medium text-desa-secondary"
              >Perkiraan Selesai</span
            >
          </div>
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
        </div>
      </div>

      <hr class="border-desa-foreshadow" />

      <div class="grid grid-cols-2 gap-3">
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
            <p class="font-semibold text-xl leading-[22.5px] text-desa-yellow">
              {{ durationDays }} Hari
            </p>
            <span class="font-medium text-desa-secondary"
              >Durasi Pengerjaan</span
            >
          </div>
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
          <p class="font-semibold text-xl leading-[22.5px] text-desa-blue">
            {{ development.development_applicants_count ?? 0 }} Pelamar
          </p>
          <span class="font-medium text-desa-blue">Total Pelamar</span>
        </div>
      </div>

      <hr class="border-desa-foreshadow" />

      <div class="flex flex-col gap-3">
        <p class="font-medium text-sm text-desa-secondary">
          Tentang Pembangunan
        </p>
        <p class="font-medium leading-8">{{ development.description }}</p>
      </div>
    </section>

    <!-- Applicants -->
    <section class="flex flex-col rounded-3xl p-6 gap-6 bg-white">
      <div class="flex items-center justify-between">
        <p class="font-medium leading-5 text-desa-secondary">
          Pengajuan Pelamar
        </p>

        <div class="grid grid-cols-4 gap-3">
          <button
            v-for="tab in TAB_OPTIONS"
            :key="tab.value"
            type="button"
            class="group"
            :class="{ active: activeTab === tab.value }"
            @click="activeTab = tab.value"
          >
            <div
              class="flex items-center justify-center rounded-full border border-desa-background py-[14px] px-[18px] group-hover:bg-desa-black group-[.active]:bg-desa-black transition-setup"
            >
              <span
                class="font-medium leading-5 text-desa-secondary group-hover:text-white group-[.active]:text-white transition-setup"
              >
                {{ tab.label }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <div
          v-for="applicant in visibleApplicants"
          :key="applicant.id"
          class="flex flex-col gap-6 rounded-3xl p-6 border border-desa-background bg-white"
        >
          <div class="flex items-center justify-between">
            <p class="flex items-center gap-1">
              <img
                src="@/assets/images/icons/calendar-2-secondary-green.svg"
                class="flex size-[18px] shrink-0"
                alt=""
                aria-hidden="true"
              />
              <span class="font-medium text-sm text-desa-secondary">
                {{ formatDate(applicant.created_at) }}
              </span>
            </p>
            <div
              class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0"
              :class="APPLICANT_STATUS_BADGE[applicant.status]?.class"
            >
              <span class="font-semibold text-xs text-white uppercase">
                {{ APPLICANT_STATUS_BADGE[applicant.status]?.label }}
              </span>
            </div>
          </div>

          <hr class="border-desa-background" />

          <div class="flex items-center gap-6 justify-between">
            <div class="flex items-center gap-3 w-[302px] shrink-0">
              <div
                class="flex size-[54px] rounded-full bg-desa-foreshadow overflow-hidden"
              >
                <img
                  :src="
                    applicant.user.head_of_family?.profile_picture ||
                    DEFAULT_THUMBNAIL
                  "
                  class="w-full h-full object-cover"
                  alt="Foto pelamar"
                />
              </div>
              <div class="flex flex-col gap-1">
                <p class="font-semibold text-lg leading-5 text-desa-black">
                  {{ applicant.user.name }}
                </p>
                <p class="flex items-center gap-1">
                  <img
                    src="@/assets/images/icons/briefcase-secondary-green.svg"
                    class="flex size-[18px] shrink-0"
                    alt=""
                    aria-hidden="true"
                  />
                  <span class="font-medium text-sm text-desa-secondary">
                    {{ applicant.user.head_of_family?.occupation }}
                  </span>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3 w-[236px] shrink-0">
              <div class="flex flex-col gap-1">
                <p class="flex items-center gap-1">
                  <img
                    src="@/assets/images/icons/keyboard-secondary-green.svg"
                    class="flex size-[18px] shrink-0"
                    alt=""
                    aria-hidden="true"
                  />
                  <span class="font-medium text-sm text-desa-secondary"
                    >NIK</span
                  >
                </p>
                <p
                  class="font-semibold text-lg leading-5 text-desa-dark-green text-nowrap"
                >
                  {{ applicant.user.head_of_family?.identity_number }}
                </p>
              </div>
            </div>

            <div
              v-if="applicant.status === 'pending'"
              class="flex items-center gap-3 justify-end shrink-0"
            >
              <button
                type="button"
                class="flex items-center w-[120px] justify-center shrink-0 gap-[10px] rounded-2xl py-4 px-6 bg-desa-red/10"
              >
                <span class="font-medium text-desa-red">Tolak</span>
              </button>
              <button
                type="button"
                class="flex items-center w-[120px] justify-center shrink-0 gap-[10px] rounded-2xl py-4 px-6 bg-desa-dark-green"
              >
                <span class="font-medium text-white">Setuju</span>
              </button>
            </div>
          </div>
        </div>

        <!-- View All / Sembunyikan -->
        <button
          v-if="hasMore || showAllApplicants"
          type="button"
          class="flex items-center justify-center h-14 rounded-2xl py-4 px-6 gap-[10px] bg-desa-dark-green transition-all duration-300"
          @click="showAllApplicants = !showAllApplicants"
        >
          <span class="font-medium leading-5 text-white">
            {{
              showAllApplicants
                ? "Sembunyikan"
                : `Lihat Semua (${remainingCount} lainnya)`
            }}
          </span>
        </button>

        <!-- Empty state -->
        <div
          v-if="filteredApplicants.length === 0"
          class="flex justify-center py-12 text-desa-secondary font-medium"
        >
          Tidak ada data pelamar
        </div>
      </div>
    </section>
  </div>
</template>
