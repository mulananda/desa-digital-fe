<script setup lang="ts">
import { computed } from "vue";
import { formatRupiah, formatToClientTimezone } from "@/helpers/format";
import { ROUTE_NAMES } from "@/config/routes.config";
import type { SocialAssistanceRecipient } from "@/types/socialAssistanceRecipient.type";
import { validateImageUrl, sanitizeAttribute } from "@/utils/sanitization";
import CardStatusPengajuan from "../common/CardStatusPengajuan.vue";

const props = defineProps<{
  item: SocialAssistanceRecipient;
}>();

/* ================= DERIVED DATA ================= */
const createdAt = computed(() => formatToClientTimezone(props.item.created_at));

const assistance = computed(() => props.item.social_assistance);
const headOfFamily = computed(() => props.item.head_of_family);

const assistanceAmount = computed(() =>
  formatRupiah(assistance.value?.amount ?? 0),
);

const submittedAmount = computed(() => formatRupiah(props.item.amount ?? 0));

// ✅ NEW: Validate image URLs
const safeAssistanceThumbnail = computed(() =>
  validateImageUrl(assistance.value?.thumbnail),
);

const safeProfilePicture = computed(() =>
  validateImageUrl(headOfFamily.value?.profile_picture),
);

const DEFAULT_THUMBNAIL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

const assistanceThumbnailUrl = computed(
  () => safeAssistanceThumbnail.value || DEFAULT_THUMBNAIL,
);

const profilePictureUrl = computed(
  () => safeProfilePicture.value || DEFAULT_THUMBNAIL,
);

// ✅ NEW: Sanitize text attributes
const safeAssistanceName = computed(() =>
  sanitizeAttribute(assistance.value?.name),
);

const safeProvider = computed(() =>
  sanitizeAttribute(assistance.value?.provider),
);

const safeName = computed(() =>
  sanitizeAttribute(headOfFamily.value?.user?.name),
);
</script>

<template>
  <div class="card flex flex-col gap-4 rounded-3xl p-6 bg-white">
    <!-- ================= HEADER ================= -->
    <div class="flex items-center justify-between">
      <p class="flex items-center gap-1">
        <img
          src="@/assets/images/icons/calendar-2-secondary-green.svg"
          class="size-[18px]"
          alt="icon"
        />
        <span class="font-medium text-sm text-desa-secondary">
          {{ createdAt }}
        </span>
      </p>

      <CardStatusPengajuan :status="item.status" />
    </div>

    <hr class="border-desa-background" />

    <!-- ================= SOCIAL ASSISTANCE ================= -->
    <div class="flex items-center w-full">
      <div
        class="w-[100px] h-20 rounded-2xl overflow-hidden bg-desa-foreshadow shrink-0"
      >
        <!-- ✅ NEW: Validated URL + fallback -->
        <img
          :src="assistanceThumbnailUrl"
          :alt="safeAssistanceName"
          class="w-full h-full object-cover"
          loading="lazy"
          @error="
            (e) => {
              (e.target as HTMLImageElement).src = DEFAULT_THUMBNAIL;
            }
          "
        />
      </div>

      <div class="flex flex-col gap-1 ml-4 flex-1">
        <p class="font-semibold text-lg line-clamp-1">
          {{ assistance?.name ?? "-" }}
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
            {{ assistance?.provider ?? "-" }}
          </span>
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div class="text-right">
          <p
            class="font-semibold text-lg leading-5 text-desa-dark-green text-nowrap"
          >
            Rp{{ assistanceAmount }}
          </p>
          <p class="font-medium text-sm text-desa-secondary">Uang Tunai</p>
        </div>

        <div
          class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
        >
          <img
            src="@/assets/images/icons/money-dark-green.svg"
            class="size-6"
            alt="icon"
          />
        </div>
      </div>
    </div>

    <hr class="border-desa-background" />

    <!-- ================= RECIPIENT ================= -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="size-[54px] rounded-full bg-desa-foreshadow overflow-hidden"
        >
          <!-- ✅ NEW: Validated profile picture URL + fallback -->
          <img
            :src="profilePictureUrl"
            class="w-full h-full object-cover"
            :alt="`Profil: ${safeName}`"
            loading="lazy"
            @error="
              (e) => {
                (e.target as HTMLImageElement).src = DEFAULT_THUMBNAIL;
              }
            "
          />
        </div>

        <div class="flex flex-col gap-1">
          <p class="font-semibold text-lg leading-5 text-desa-black">
            {{ headOfFamily?.user?.name ?? "-" }}
          </p>

          <p class="flex items-center gap-1">
            <img
              src="@/assets/images/icons/briefcase-secondary-green.svg"
              class="size-[18px]"
              :alt="`Pekerjaan: ${sanitizeAttribute(headOfFamily?.occupation)}`"
              loading="lazy"
            />
            <span class="font-medium text-sm text-desa-secondary">
              {{ headOfFamily?.occupation ?? "-" }}
            </span>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div
          class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
        >
          <img
            src="@/assets/images/icons/receive-square-2-dark-green.svg"
            class="size-6"
            alt="icon"
          />
        </div>

        <div class="flex flex-col gap-1">
          <p
            class="font-semibold text-lg leading-5 text-desa-dark-green text-nowrap"
          >
            Rp{{ submittedAmount }}
          </p>
          <p class="font-medium text-sm text-desa-secondary">
            Nominal Pengajuan
          </p>
        </div>
      </div>

      <RouterLink
        :to="{
          name: ROUTE_NAMES.MANAGE_SOCIAL_ASSISTANCE_RECIPIENT,
          params: { id: item.id },
        }"
        class="flex items-center gap-[10px] rounded-2xl py-4 px-6 bg-desa-black text-white shrink-0"
        :aria-label="`Kelola pengajuan: ${headOfFamily?.user?.name}`"
      >
        Manage
      </RouterLink>
    </div>
  </div>
</template>
