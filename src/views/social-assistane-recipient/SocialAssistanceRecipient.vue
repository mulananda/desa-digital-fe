<script setup lang="ts">
import { useSocialAssistanceRecipient } from "@/composables/social-assistance-recipients/useSocialAssistanceRecipient";
import { useRecipientApproval } from "@/composables/social-assistance-recipients/useRecipientApproval";
import { formatRupiah, formatToClientTimezone } from "@/helpers/format";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import LoadingState from "@/components/ui/state/LoadingState.vue";
import ErrorState from "@/components/ui/state/ErrorState.vue";

/* =========================================================
 * 2. STATIC CONFIG (UI ONLY)
 * ========================================================= */
const DEFAULT_THUMBNAIL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

/* =========================================================
 * ROUTE PARAM
 * ========================================================= */
const route = useRoute();

const recipientId = computed<string | null>(() => {
  const id = route.params.id;
  return typeof id === "string" ? id : null;
});

/* =========================================================
 * FETCH DATA
 * ========================================================= */
const { recipient, isPending, isFetching, isError, error, refetch } =
  useSocialAssistanceRecipient(recipientId);

/* =========================================================
 * APPROVAL MUTATION
 * — Tidak perlu shallowRef + watch, langsung computed
 * — useRecipientApproval dipanggil sekali dengan id reactive
 * ========================================================= */
const { approve, reject, isApproving, isRejecting } = useRecipientApproval(
  recipientId.value!, // ← route.params.id sudah pasti ada saat halaman ini diakses
);

/* =========================================================
 * FILE UPLOAD
 * ========================================================= */
const proofFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

watch(proofFile, (file, _, onCleanup) => {
  if (!file) {
    previewUrl.value = null;
    return;
  }
  const url = URL.createObjectURL(file);
  previewUrl.value = url;
  onCleanup(() => URL.revokeObjectURL(url));
});

function handleFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  proofFile.value = files?.[0] ?? null;
}

function triggerFile() {
  if (!canTakeAction.value) return;
  fileInputRef.value?.click();
}

/* =========================================================
 * REJECTION REASON
 * ========================================================= */
const rejectionReason = ref("");

watch(
  recipient,
  (data) => {
    if (!data) return;
    rejectionReason.value =
      data.status === "rejected" ? (data.rejection_reason ?? "-") : "";
  },
  { immediate: true },
);

/* =========================================================
 * UI STATE
 * ========================================================= */
const canTakeAction = computed(() => recipient.value?.status === "pending");

// Map status → badge config
const STATUS_BADGE: Record<string, { label: string; class: string }> = {
  pending: { label: "Menunggu", class: "bg-desa-yellow" },
  approved: { label: "Disetujui", class: "bg-desa-green" },
  rejected: { label: "Ditolak", class: "bg-desa-red" },
};

const statusBadge = computed(() => {
  const status = recipient.value?.status ?? "pending";
  return STATUS_BADGE[status] ?? STATUS_BADGE["pending"];
});

/* =========================================================
 * HANDLERS
 * ========================================================= */
function handleApprove() {
  if (!proofFile.value) return;
  approve({
    status: "approved",
    proof: proofFile.value,
  });
}

function handleReject() {
  reject({
    status: "reject",
    rejection_reason: rejectionReason.value || "-",
  });
}
</script>

<template>
  <!-- Breadcrumb -->
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-2">
      <nav class="flex gap-1 items-center leading-5 text-desa-secondary">
        <span class="capitalize">Pengajuan Bantuan sosial</span>
        <span aria-hidden="true">/</span>
        <span class="text-desa-dark-green font-semibold capitalize">
          Manage penyetujuan bansos
        </span>
      </nav>
      <h1 class="font-semibold text-2xl">Manage Penyetujuan Bansos</h1>
    </div>
  </div>

  <LoadingState
    v-if="isPending"
    label="Memuat detail penerima bantuan sosial..."
  />
  <LoadingState v-else-if="isFetching" label="Memperbarui detail..." />

  <!-- Fix: error.message bukan error langsung -->
  <ErrorState
    v-else-if="isError && error"
    :message="error.message"
    @retry="refetch"
  />

  <div v-else-if="recipient" class="flex gap-[14px]">
    <!-- Detail Bantuan Sosial -->
    <section
      class="flex flex-col shrink-0 w-[calc(545/1000*100%)] h-fit rounded-3xl p-6 gap-6 bg-white"
    >
      <p class="font-medium leading-5 text-desa-secondary">
        Detail Bantuan Sosial
      </p>

      <div class="flex items-center justify-between gap-4">
        <div
          class="flex w-[120px] h-[100px] shrink-0 rounded-2xl overflow-hidden bg-desa-foreshadow"
        >
          <img
            :src="recipient.social_assistance.thumbnail || DEFAULT_THUMBNAIL"
            class="w-full h-full object-cover"
            alt="Thumbnail bantuan sosial"
          />
        </div>

        <!-- pakai statusBadge computed -->
        <div
          class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0"
          :class="statusBadge.class"
        >
          <span class="font-semibold text-xs text-white uppercase">
            {{ statusBadge.label }}
          </span>
        </div>
      </div>

      <div class="flex flex-col gap-[6px] w-full">
        <p class="font-semibold text-xl line-clamp-1">
          {{ recipient.social_assistance?.name }}
        </p>
        <p class="flex items-center gap-1">
          <img
            src="@/assets/images/icons/profile-secondary-green.svg"
            class="flex size-[18px] shrink-0"
            alt=""
            aria-hidden="true"
          />
          <span class="font-medium text-sm text-desa-secondary">
            {{ recipient.social_assistance?.provider }}
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
          <p
            class="font-semibold text-lg leading-[22.5px] text-desa-dark-green"
          >
            Rp{{ formatRupiah(recipient.social_assistance?.amount ?? 0) }}
          </p>
          <span class="font-medium text-desa-secondary">Uang Tunai</span>
        </div>
      </div>

      <hr class="border-desa-foreshadow" />

      <div class="flex items-center w-full gap-3">
        <div
          class="flex size-[52px] shrink-0 rounded-2xl bg-desa-red/10 items-center justify-center"
        >
          <img
            src="@/assets/images/icons/minus-square-red.svg"
            class="flex size-6 shrink-0"
            alt=""
            aria-hidden="true"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p class="font-semibold text-lg leading-[22.5px] text-desa-red">
            Rp92.000.000
          </p>
          <span class="font-medium text-desa-secondary">Sisa Bansos</span>
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
            {{
              recipient.social_assistance?.social_assistance_recipients_count ??
              0
            }}
            Warga
          </p>
          <span class="font-medium text-desa-secondary">Total Pengajuan</span>
        </div>
      </div>

      <hr class="border-desa-foreshadow" />

      <div class="flex flex-col gap-3">
        <p class="font-medium text-sm text-desa-secondary">Tentang Bantuan</p>
        <p class="font-medium leading-8">
          {{ recipient.social_assistance?.description }}
        </p>
      </div>
    </section>

    <!-- Detail Pengajuan -->
    <section
      class="flex flex-col flex-1 h-fit shrink-0 rounded-3xl p-6 gap-6 bg-white"
    >
      <p class="font-medium leading-5 text-desa-secondary">Detail Pengajuan</p>

      <div class="flex items-center gap-3 w-[302px] shrink-0">
        <div
          class="flex size-[54px] rounded-full bg-desa-foreshadow overflow-hidden"
        >
          <img
            :src="
              recipient.head_of_family?.profile_picture || DEFAULT_THUMBNAIL
            "
            class="w-full h-full object-cover"
            alt="Foto kepala keluarga"
          />
        </div>
        <div class="flex flex-col gap-1">
          <p class="font-semibold text-lg leading-5 text-desa-black">
            {{ recipient.head_of_family?.user?.name }}
          </p>
          <p class="flex items-center gap-1">
            <img
              src="@/assets/images/icons/briefcase-secondary-green.svg"
              class="flex size-[18px] shrink-0"
              alt=""
              aria-hidden="true"
            />
            <span class="font-medium text-sm text-desa-secondary">
              {{ recipient.head_of_family?.occupation }}
            </span>
          </p>
        </div>
      </div>

      <hr class="border-desa-background" />

      <div class="flex items-center gap-3 w-[302px] shrink-0">
        <div
          class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
        >
          <img
            src="@/assets/images/icons/profile-2user-dark-green.svg"
            class="flex size-6 shrink-0"
            alt=""
            aria-hidden="true"
          />
        </div>
        <div class="flex flex-col gap-1">
          <p class="font-semibold text-lg leading-5">
            <!-- Fix: hapus duplikat "Anggota Anggota" -->
            {{ recipient.head_of_family?.family_members_count ?? 0 }} Anggota
          </p>
          <p class="font-medium text-sm text-desa-secondary">Total Keluarga</p>
        </div>
      </div>

      <hr class="border-desa-background" />

      <div class="flex items-center gap-3 w-[302px] shrink-0">
        <div
          class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
        >
          <img
            src="@/assets/images/icons/keyboard-dark-green.svg"
            class="flex size-6 shrink-0"
            alt=""
            aria-hidden="true"
          />
        </div>
        <div class="flex flex-col gap-1">
          <p class="font-semibold text-lg leading-5">
            {{ recipient.head_of_family?.identity_number }}
          </p>
          <p class="font-medium text-sm text-desa-secondary">
            Nomor Induk Kependudukan
          </p>
        </div>
      </div>

      <hr class="border-desa-background" />

      <div class="flex items-center gap-3 w-[302px] shrink-0">
        <div
          class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
        >
          <img
            src="@/assets/images/icons/calendar-2-dark-green.svg"
            class="flex size-6 shrink-0"
            alt=""
            aria-hidden="true"
          />
        </div>
        <div class="flex flex-col gap-1">
          <p class="font-semibold text-lg leading-5">
            {{ formatToClientTimezone(recipient.created_at) }}
          </p>
          <p class="font-medium text-sm text-desa-secondary">
            Tanggal Pengajuan
          </p>
        </div>
      </div>

      <hr class="border-desa-background" />

      <div class="flex items-center gap-3 w-[302px] shrink-0">
        <div
          class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
        >
          <img
            src="@/assets/images/icons/receive-square-2-dark-green.svg"
            class="flex size-6 shrink-0"
            alt=""
            aria-hidden="true"
          />
        </div>
        <div class="flex flex-col gap-1">
          <p class="font-semibold text-lg leading-5">
            Rp{{ formatRupiah(recipient.amount) }}
          </p>
          <p class="font-medium text-sm text-desa-secondary">
            Nominal Pengajuan
          </p>
        </div>
      </div>

      <hr class="border-desa-background" />

      <div class="flex flex-col gap-1">
        <p class="font-medium text-sm text-desa-secondary">Pesan Pengajuan:</p>
        <p class="font-medium leading-8">"{{ recipient.reason }}"</p>
      </div>

      <hr class="border-desa-background" />

      <!-- Rekening -->
      <div class="flex flex-col gap-6">
        <p class="font-medium text-sm text-desa-secondary">
          Rekening Kepala Rumah
        </p>
        <div class="flex items-center gap-3">
          <div
            class="flex w-[120px] h-[60px] rounded-2xl border border-desa-background py-3 px-0.5 items-center justify-center bg-desa-blue/10 overflow-hidden"
          >
            <img
              v-if="recipient.bank === 'bca'"
              src="@/assets/images/logos/bca.svg"
              class="w-full h-full object-contain"
              alt="BCA"
            />
            <img
              v-if="recipient.bank === 'bri'"
              src="@/assets/images/logos/bni.svg"
              class="w-full h-full object-contain"
              alt="BRI"
            />
            <img
              v-if="recipient.bank === 'mandiri'"
              src="@/assets/images/logos/mandiri.svg"
              class="w-full h-full object-contain"
              alt="Mandiri"
            />
          </div>
          <div>
            <p class="font-medium text-sm text-desa-secondary">
              {{ recipient.head_of_family?.user.name }}
            </p>
            <div class="flex items-center gap-1">
              <img
                src="@/assets/images/icons/document-copy-dark-green.svg"
                class="flex size-[18px] shrink-0"
                alt=""
                aria-hidden="true"
              />
              <p class="font-semibold text-lg text-desa-dark-green">
                {{ recipient.account_number }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr class="border-desa-background" />

      <!-- Form Approval -->
      <form @submit.prevent class="flex flex-col gap-6">
        <p class="font-medium text-sm text-desa-secondary">
          Bukti Pemberian Bansos
        </p>

        <div class="flex items-center justify-between">
          <div
            class="flex items-center justify-center w-[120px] h-[100px] rounded-2xl overflow-hidden bg-desa-foreshadow"
          >
            <img
              :src="
                previewUrl ??
                (recipient.proof?.trim() ? recipient.proof : DEFAULT_THUMBNAIL)
              "
              alt="Bukti pemberian bansos"
              class="size-full object-cover"
            />
          </div>

          <!-- Fix: hidden + trigger manual, konsisten dengan audit sebelumnya -->
          <div>
            <input
              ref="fileInputRef"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              class="hidden"
              tabindex="-1"
              aria-hidden="true"
              @change="handleFileChange"
            />
            <button
              type="button"
              :disabled="!canTakeAction || isApproving || isRejecting"
              class="flex items-center py-4 px-6 rounded-2xl bg-desa-black gap-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
              @click="triggerFile"
            >
              <img
                src="@/assets/images/icons/send-square-white.svg"
                alt=""
                aria-hidden="true"
                class="size-6 shrink-0"
              />
              <span class="font-medium leading-5 text-white">Upload</span>
            </button>
          </div>
        </div>

        <hr class="border-desa-background" />

        <!-- Keterangan / Alasan Penolakan -->
        <div class="flex flex-col gap-1">
          <p class="font-medium text-sm text-desa-secondary">Keterangan</p>
          <textarea
            v-model="rejectionReason"
            name="rejection_reason"
            placeholder="Masukan Keterangan....."
            rows="6"
            :readonly="!canTakeAction"
            class="appearance-none outline-none w-full rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 px-4 font-medium placeholder:text-desa-secondary transition-all duration-300 bg-white read-only:bg-gray-50 read-only:cursor-not-allowed resize-none"
          />
        </div>

        <hr class="border-desa-background" />

        <!-- Action Buttons -->
        <div class="flex items-center gap-3 w-full">
          <button
            type="button"
            :disabled="!canTakeAction || isRejecting || isApproving"
            class="flex items-center w-full justify-center gap-[10px] rounded-2xl py-4 px-6 bg-desa-red/10 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleReject"
          >
            <span class="font-medium text-desa-red">
              {{
                !canTakeAction
                  ? "Sudah Diproses"
                  : isRejecting
                    ? "Memproses..."
                    : "Tolak"
              }}
            </span>
          </button>

          <button
            type="button"
            :disabled="!canTakeAction || isApproving || isRejecting"
            class="flex items-center w-full justify-center gap-[10px] rounded-2xl py-4 px-6 bg-desa-dark-green disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleApprove"
          >
            <span class="font-medium text-white">
              {{
                !canTakeAction
                  ? "Sudah Diproses"
                  : isApproving
                    ? "Memproses..."
                    : "Setuju"
              }}
            </span>
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
