<script setup lang="ts">
import { computed, ref } from "vue";
import { ROUTE_NAMES } from "@/config/routes.config";
import { formatRupiah, formatToClientTimezone } from "@/helpers/format";
import { validateImageUrl, sanitizeAttribute } from "@/utils/sanitization";
import type { Development } from "@/types/development.type";
import ModalDelete from "../ui/ModalDelete.vue";
import { useDeleteDevelopment } from "@/composables/development/useDeleteDevelopment";

const DEFAULT_THUMBNAIL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

const props = defineProps<{
  item: Development;
}>();

// ✅ NEW: Safe image URL validation
const safeImageUrl = computed(() => {
  if (!props.item?.thumbnail) {
    return DEFAULT_THUMBNAIL;
  }
  return validateImageUrl(props.item.thumbnail)
    ? props.item.thumbnail
    : DEFAULT_THUMBNAIL;
});

// ✅ NEW: Safe attribute sanitization
const safeName = computed(() => sanitizeAttribute(props.item?.name || ""));
const safePersonInCharge = computed(() =>
  sanitizeAttribute(props.item?.person_in_charge || ""),
);

// ✅ NEW: Image error fallback handler
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src = DEFAULT_THUMBNAIL;
};
</script>

<template>
  <div class="card flex flex-col gap-6 rounded-3xl p-6 bg-white">
    <div class="flex items-center w-full">
      <div
        class="flex w-[100px] h-20 shrink-0 rounded-2xl overflow-hidden bg-desa-foreshadow"
      >
        <img
          :src="safeImageUrl"
          loading="lazy"
          class="w-full h-full object-cover"
          alt="Thumbnail pembangunan"
          @error="handleImageError"
        />
      </div>
      <div class="flex flex-col gap-[6px] w-full ml-4 mr-9">
        <p class="font-semibold text-lg leading-[22.5px] line-clamp-1">
          {{ safeName }}
        </p>
        <div class="flex items-center gap-1">
          <img
            src="@/assets/images/icons/user-square-secondary-green.svg"
            class="flex size-[18px] shrink-0"
            alt="icon"
          />
          <p class="font-medium text-sm text-desa-secondary">
            Penanggung Jawab:
            <span class="font-medium text-base text-desa-dark-green">
              {{ safePersonInCharge }}
            </span>
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <RouterLink
          :to="{
            name: ROUTE_NAMES.MANAGE_DEVELOPMENT,
            params: { id: item.id },
          }"
          class="flex items-center shrink-0 gap-[10px] rounded-2xl py-4 px-6 bg-desa-black"
          aria-label="Kelola pembangunan desa"
        >
          <span class="font-medium text-white">Manage</span>
        </RouterLink>
      </div>
    </div>
    <hr class="border-desa-background" />
    <div class="grid grid-cols-3 gap-3">
      <div class="flex items-center gap-3">
        <div
          class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-red/10 overflow-hidden"
        >
          <img
            src="@/assets/images/icons/wallet-3-red.svg"
            class="flex size-6 shrink-0"
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1">
          <p class="font-semibold text-lg leading-5 text-desa-red">
            Rp{{ formatRupiah(item.amount) }}
          </p>
          <p class="font-medium text-sm text-desa-secondary">
            Dana Pembangunan
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div
          class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-blue/10 overflow-hidden"
        >
          <img
            src="@/assets/images/icons/profile-2user-blue.svg"
            class="flex size-6 shrink-0"
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1">
          <p class="font-semibold text-lg leading-5 text-desa-blue">
            {{ item.development_applicants_count || 0 }} Warga
          </p>
          <p class="font-medium text-sm text-desa-secondary">Total Pelamar</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div
          class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
        >
          <img
            src="@/assets/images/icons/calendar-2-dark-green.svg"
            class="flex size-6 shrink-0"
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1">
          <p class="font-semibold text-lg leading-5 text-desa-dark-green">
            {{ formatToClientTimezone(item.start_date) }}
          </p>
          <p class="font-medium text-sm text-desa-secondary">
            Tanggal Pelaksanaan
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
