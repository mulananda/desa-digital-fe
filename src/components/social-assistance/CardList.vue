<!-- src/components/social-assistance/CardList.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { ROUTE_NAMES } from "@/config/routes.config";
import { formatRupiah } from "@/helpers/format";
import type { SocialAssistance } from "@/types/socialAssistance.type";
import { validateImageUrl, sanitizeAttribute } from "@/utils/sanitization";
import CardStatKetersediaan from "../common/CardStatKetersediaan.vue";

const props = defineProps<{
  item: SocialAssistance;
}>();

/* =====================
 * Computed View Model
 * ===================== */
const formattedAmount = computed(() => formatRupiah(props.item.amount));

const recipientCount = computed(
  () => props.item.social_assistance_recipients_count ?? 0,
);

// ✅ NEW: Validate image URLs
const safeImageUrl = computed(() => validateImageUrl(props.item.thumbnail));

// ✅ NEW: Sanitize text attributes
const safeProvider = computed(() => sanitizeAttribute(props.item.provider));

const safeName = computed(() => sanitizeAttribute(props.item.name));

// ✅ NEW: Fallback image
const DEFAULT_THUMBNAIL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

const imageUrl = computed(() => safeImageUrl.value || DEFAULT_THUMBNAIL);
</script>

<template>
  <div class="card flex flex-col gap-6 rounded-3xl p-6 bg-white">
    <!-- Header -->
    <div class="flex items-center w-full">
      <div
        class="flex w-[100px] h-20 shrink-0 rounded-2xl overflow-hidden bg-desa-foreshadow"
      >
        <!-- ✅ NEW: Validated URL + fallback -->
        <img
          :src="imageUrl"
          :alt="safeName"
          class="w-full h-full object-cover"
          loading="lazy"
          @error="
            (e) => {
              (e.target as HTMLImageElement).src = DEFAULT_THUMBNAIL;
            }
          "
        />
      </div>

      <div class="flex flex-col gap-[6px] w-full ml-4 mr-9">
        <p class="font-semibold text-lg leading-[22.5px] line-clamp-1">
          {{ item.name }}
        </p>
        <p class="flex items-center gap-1">
          <img
            src="@/assets/images/icons/profile-secondary-green.svg"
            :alt="`Penyedia: ${safeProvider}`"
            class="size-[18px]"
            loading="lazy"
          />
          <!-- ✅ Vue auto-escapes text content -->
          <span class="font-medium text-sm text-desa-secondary">
            {{ item.provider || "Penyedia tidak tersedia" }}
          </span>
        </p>
      </div>

      <RouterLink
        :to="{
          name: ROUTE_NAMES.MANAGE_SOCIAL_ASSISTANCE,
          params: { id: item.id },
        }"
        class="flex items-center shrink-0 gap-[10px] rounded-2xl py-4 px-6 bg-desa-black hover:bg-desa-black/90 transition-colors"
        :aria-label="`Kelola bantuan sosial: ${item.name}`"
      >
        <span class="font-medium text-white">Manage</span>
      </RouterLink>
    </div>

    <hr class="border-desa-background" />

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-3">
      <div class="flex items-center gap-3">
        <div
          class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
        >
          <img
            src="@/assets/images/icons/money-dark-green.svg"
            alt="Jumlah dana tunai"
            loading="lazy"
          />
        </div>
        <div class="flex flex-col gap-1">
          <p class="font-semibold text-lg leading-5 text-desa-dark-green">
            Rp {{ formattedAmount }}
          </p>
          <p class="font-medium text-sm text-desa-secondary">Uang Tunai</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div
          class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-blue/10 overflow-hidden"
        >
          <img
            src="@/assets/images/icons/profile-2user-blue.svg"
            alt="Jumlah penerima bantuan"
            loading="lazy"
          />
        </div>
        <div class="flex flex-col gap-1">
          <p class="font-semibold text-lg leading-5 text-desa-blue">
            {{ recipientCount }} Warga
          </p>
          <p class="font-medium text-sm text-desa-secondary">Total Pengajuan</p>
        </div>
      </div>

      <CardStatKetersediaan :available="item.is_available" />
    </div>
  </div>
</template>
