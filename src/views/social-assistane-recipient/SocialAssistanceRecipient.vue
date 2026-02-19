<script setup lang="ts">
import { useSocialAssistanceRecipient } from "@/composables/social-assistance-recipients/useSocialAssistanceRecipient";
import { useRecipientApproval } from "@/composables/social-assistance-recipients/useRecipientApproval";
import { formatRupiah, formatToClientTimezone } from "@/helpers/format";
import { computed, ref, watch, shallowRef } from "vue";
import { useRoute } from "vue-router";

/* =========================================================
 * ROUTE PARAM
 * ========================================================= */

// Ambil instance route
const route = useRoute();

// Ambil ID dari URL dan pastikan bertipe string
// Menghindari error jika params bukan string
const recipientId = computed<string | null>(() => {
  const id = route.params.id;
  return typeof id === "string" ? id : null;
});

/* =========================================================
 * FETCH DATA DETAIL PENGAJUAN
 * ========================================================= */

// Mengambil detail pengajuan berdasarkan recipientId
// isLoading   → pertama kali load
// isFetching  → refetch data
// error       → jika terjadi kesalahan
const { recipient, isLoading, isFetching, error, refetch } =
  useSocialAssistanceRecipient(recipientId);

// Fungsi untuk retry fetch jika terjadi error
const handleRefetch = () => refetch();

/* =========================================================
 * STATE APPROVAL
 * ========================================================= */

// Menyimpan file bukti pencairan (tidak perlu deep reactivity)
const proofFile = shallowRef<File | null>(null);

// Menyimpan alasan penolakan
const rejectionReason = ref("");

/**
 * Sync alasan reject dari backend ke textarea
 *
 * - Jika status rejected → tampilkan alasan dari backend
 * - Jika status pending → kosongkan textarea
 *
 * immediate: true → langsung jalan saat pertama kali load
 */
watch(
  () => recipient.value,
  (data) => {
    if (!data) return;

    if (data.status === "rejected") {
      rejectionReason.value = data.rejection_reason ?? "-";
    }

    if (data.status === "pending") {
      rejectionReason.value = "";
    }
  },
  { immediate: true },
);

/* =========================================================
 * INITIALIZE MUTATION (ANTI RACE CONDITION)
 * ========================================================= */

// Tempat menyimpan instance mutation approve/reject
// Bisa null karena recipientId belum tentu tersedia saat awal render
const approval = shallowRef<ReturnType<typeof useRecipientApproval> | null>(
  null,
);

// Membuat mutation hanya jika recipientId sudah tersedia
// Menghindari race condition & penggunaan non-null assertion (!)
watch(
  recipientId,
  (id) => {
    if (!id) return;
    approval.value = useRecipientApproval(id);
  },
  { immediate: true },
);

/* =========================================================
 * IMAGE PREVIEW (UPLOAD BUKTI)
 * ========================================================= */

// Menyimpan URL preview gambar sementara
const previewUrl = ref<string | null>(null);

// Setiap file berubah → buat objectURL untuk preview
// onCleanup digunakan untuk mencegah memory leak
watch(proofFile, (file, _, onCleanup) => {
  if (!file) {
    previewUrl.value = null;
    return;
  }

  const url = URL.createObjectURL(file);
  previewUrl.value = url;

  // Hapus URL saat file berubah / component unmount
  onCleanup(() => {
    URL.revokeObjectURL(url);
  });
});

/* =========================================================
 * HANDLERS
 * ========================================================= */

// Saat user memilih file
const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  proofFile.value = files?.[0] ?? null;
};

// Saat klik tombol Setuju
const handleApprove = () => {
  // Pastikan file dan mutation tersedia
  if (!proofFile.value || !approval.value) return;

  approval.value.approve({
    status: "approved",
    proof: proofFile.value, // kirim file ke backend
  });
};

// Saat klik tombol Tolak
const handleReject = () => {
  if (!approval.value) return;

  approval.value.reject({
    status: "reject",
    rejection_reason: rejectionReason.value || "-", // kirim alasan
  });
};

// Referensi ke input file (disembunyikan)
const fileInputRef = ref<HTMLInputElement | null>(null);

// Trigger klik input file secara manual (custom upload button)
const triggerFile = () => {
  if (!canTakeAction.value) return;
  fileInputRef.value?.click();
};

/* =========================================================
 * UI STATE (LOADING MUTATION)
 * ========================================================= */

// True saat proses approve sedang berjalan
const isApproving = computed(() => approval.value?.isApproving.value ?? false);

// True saat proses reject sedang berjalan
const isRejecting = computed(() => approval.value?.isRejecting.value ?? false);

/* =========================================================
 * PROTECTION LOGIC
 * ========================================================= */

// Aksi hanya boleh dilakukan jika status masih pending
// Digunakan untuk disable button & readonly textarea
const canTakeAction = computed(() => {
  return recipient.value?.status === "pending";
});
</script>

<template>
  <div id="Header" class="flex items-center justify-between">
    <div class="flex flex-col gap-2">
      <div class="flex gap-1 items-center leading-5 text-desa-secondary">
        <p
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Pengajuan Bantuan sosial
        </p>
        <span>/</span>
        <p
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Manage penyetujuan bansos
        </p>
      </div>
      <h1 class="font-semibold text-2xl">Manage Penyetujuan Bansos</h1>
    </div>
  </div>

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
  <div v-else-if="error" class="flex justify-center py-12">
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

  <div v-else-if="recipient" class="flex gap-[14px]">
    <section
      id="Detail"
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
            :src="recipient.social_assistance.thumbnail"
            class="w-full h-full object-cover"
            alt="photo"
          />
        </div>

        <div
          class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-yellow"
          v-if="recipient.status === 'pending'"
        >
          <span class="font-semibold text-xs text-white uppercase"
            >Menunggu</span
          >
        </div>
        <div
          class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-green"
          v-if="recipient.status === 'approved'"
        >
          <span class="font-semibold text-xs text-white uppercase"
            >Disetujui</span
          >
        </div>
        <div
          class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-red"
          v-if="recipient.status === 'rejected'"
        >
          <span class="font-semibold text-xs text-white uppercase"
            >Ditolak</span
          >
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
            alt="icon"
          />
          <span class="font-medium text-sm text-desa-secondary">{{
            recipient.social_assistance?.provider
          }}</span>
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
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p
            class="font-semibold text-lg leading-[22.5px] text-desa-dark-green"
          >
            Rp{{ formatRupiah(recipient.social_assistance?.amount ?? 0) }}
          </p>
          <span class="font-medium text-desa-secondary"> Uang Tunai </span>
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
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p class="font-semibold text-lg leading-[22.5px] text-desa-red">
            Rp92.000.000
          </p>
          <span class="font-medium text-desa-secondary"> Sisa Bansos </span>
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
            {{
              recipient.social_assistance?.social_assistance_recipients_count ??
              0
            }}
            Warga
          </p>
          <span class="font-medium text-desa-secondary"> Total Pengajuan </span>
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
    <section
      class="flex flex-col flex-1 h-fit shrink-0 rounded-3xl p-6 gap-6 bg-white"
    >
      <p class="font-medium leading-5 text-desa-secondary">Detail Pengajuan</p>
      <div class="flex items-center gap-3 w-[302px] shrink-0">
        <div
          class="flex size-[54px] rounded-full bg-desa-foreshadow overflow-hidden"
        >
          <img
            :src="recipient.head_of_family?.profile_picture"
            class="w-full h-full object-cover"
            alt="icon"
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
              alt="icon"
            />
            <span class="font-medium text-sm text-desa-secondary">{{
              recipient.head_of_family?.occupation
            }}</span>
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
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1">
          <p class="font-semibold text-lg leading-5">
            {{ recipient.head_of_family?.family_members_count || 0 }} Anggota
            Anggota
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
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1">
          <p class="font-semibold text-lg leading-5">
            {{ recipient.head_of_family?.identity_number }}
          </p>
          <p class="font-medium text-sm text-desa-secondary">
            Nomer Induk Kependudukan
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
            alt="icon"
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
            alt="icon"
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
        <p class="font-medium leading-8">“{{ recipient.reason }}”</p>
      </div>
      <hr class="border-desa-background" />
      <div class="flex flex-col gap-6">
        <p class="font-medium text-sm text-desa-secondary">
          Rekening Kepala Rumah
        </p>
        <div class="flex items-center gap-3">
          <div
            class="flex w-[120px] h-[60px] rounded-2xl border border-desa-background py-3 px-0.5 items-center justify-center bg-desa-blue/10 overflow-hidden"
          >
            <img
              src="@/assets/images/logos/bca.svg"
              class="w-full h-full object-contain"
              alt="icon"
              v-if="recipient.bank === 'bca'"
            />
            <img
              src="@/assets/images/logos/bni.svg"
              class="w-full h-full object-contain"
              alt="icon"
              v-if="recipient.bank === 'bri'"
            />
            <img
              src="@/assets/images/logos/mandiri.svg"
              class="w-full h-full object-contain"
              alt="icon"
              v-if="recipient.bank === 'mandiri'"
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
                alt="icon"
              />
              <p class="font-semibold text-lg text-desa-dark-green">
                {{ recipient.account_number }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <hr class="border-desa-background" />
      <form @submit.prevent class="flex flex-col gap-6">
        <p class="font-medium text-sm text-desa-secondary">
          Bukti Pemberian Bansos
        </p>
        <div class="flex items-center justify-between">
          <div
            id="Photo-Preview"
            class="flex itce justify-center w-[120px] h-[100px] rounded-2xl overflow-hidden bg-desa-foreshadow"
          >
            <img
              id="Photo"
              :src="
                previewUrl
                  ? previewUrl
                  : recipient?.proof?.trim()
                    ? recipient.proof
                    : '/images/thumbnails/thumbnail-bansos-preview.svg'
              "
              alt="image"
              class="size-full object-cover"
            />
          </div>
          <div class="relative">
            <input
              ref="fileInputRef"
              type="file"
              name="file"
              accept="image/*"
              class="absolute opacity-0 left-0 w-full top-0 h-full"
              @change="handleFileChange"
            />
            <button
              id="Upload"
              :disabled="!canTakeAction || isApproving || isRejecting"
              type="button"
              @click="triggerFile"
              class="relative flex items-center py-4 px-6 rounded-2xl bg-desa-black gap-[10px]"
            >
              <img
                src="@/assets/images/icons/send-square-white.svg"
                alt="icon"
                class="size-6 shrink-0"
              />
              <p class="font-medium leading-5 text-white">Upload</p>
            </button>
          </div>
        </div>
        <hr class="border-desa-background" />

        <div class="flex flex-col gap-1">
          <p class="font-medium text-sm text-desa-secondary">Keterangan</p>
          <p class="font-semibold text-sm leading-5">
            <textarea
              v-model="rejectionReason"
              name="rejection_reason"
              placeholder="Masukan Keterangan ..... "
              rows="6"
              :readonly="recipient.status !== 'pending'"
              class="appearance-none outline-none w-full rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 px-4 font-medium placeholder:text-desa-secondary transition-all duration-300 bg-white readonly:bg-gray-50"
            ></textarea>
          </p>
        </div>
        <hr class="border-desa-background" />
        <div class="flex items-center gap-3 w-full">
          <button
            type="button"
            :disabled="!canTakeAction || isRejecting"
            @click="handleReject"
            class="flex items-center w-full justify-center gap-[10px] rounded-2xl py-4 px-6 bg-desa-red/10"
          >
            <span class="font-medium text-desa-red">{{
              !canTakeAction
                ? "Sudah Diproses"
                : isRejecting
                  ? "Memproses..."
                  : "Tolak"
            }}</span>
          </button>
          <button
            type="button"
            :disabled="!canTakeAction || isApproving"
            @click="handleApprove"
            class="flex items-center w-full justify-center gap-[10px] rounded-2xl py-4 px-6 bg-desa-dark-green"
          >
            <span class="font-medium text-white">{{
              !canTakeAction
                ? "Sudah Diproses"
                : isApproving
                  ? "Memproses..."
                  : "Setuju"
            }}</span>
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
