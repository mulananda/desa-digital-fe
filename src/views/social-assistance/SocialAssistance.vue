<script setup>
import { useSocialAssistanceStore } from "@/stores/socialAssistance";
import { storeToRefs } from "pinia";
import { onMounted, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ROUTE_NAMES } from "@/config/routes.config";

// components
import ModalDelete from "@/components/ui/ModalDelete.vue";
import { formatRupiah, formatToClientTimezone } from "@/helpers/format";

const route = useRoute();
const router = useRouter();

const socialAssistanceStore = useSocialAssistanceStore();
const { loading } = storeToRefs(socialAssistanceStore);
const { fetchSocialAssistance, deleteSocialAssistance } = socialAssistanceStore;

const socialAssistance = ref({});
const showModalDelete = ref(false);

// ID dari route
const socialAssistanceId = computed(() => route.params.id);

// loading khusus delete
const isDeleting = computed(() => loading.value);

// fetch data
const fetchData = async () => {
  try {
    socialAssistance.value = await fetchSocialAssistance(
      socialAssistanceId.value,
    );
  } catch {
    // optional: redirect / fallback
  }
};

onMounted(fetchData);

// delete handler
async function handleDelete() {
  if (!socialAssistanceId.value) return;

  try {
    await deleteSocialAssistance(socialAssistanceId.value);
    showModalDelete.value = false;
    await router.push({ name: ROUTE_NAMES.SOCIAL_ASSISTANCE });
  } catch {
    showModalDelete.value = false;
  }
}
</script>

<template>
  <div id="Header" class="flex items-center justify-between">
    <!-- LOADING -->
    <div v-if="loading" class="p-4">
      <p>Loading data...</p>
    </div>
    <div class="flex flex-col gap-2">
      <div class="flex gap-1 items-center leading-5 text-desa-secondary">
        <p
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Bantuan sosial
        </p>
        <span>/</span>
        <p
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Manage bantuan sosial
        </p>
      </div>
      <h1 class="font-semibold text-2xl">Manage Bantuan Sosial</h1>
    </div>
    <div class="flex items-center gap-3">
      <button
        data-modal="Modal-Delete"
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
      <RouterLink
        :to="{
          name: ROUTE_NAMES.EDIT_SOCIAL_ASSISTANCE,
          params: { id: socialAssistance.id },
        }"
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
  </div>
  <div class="flex gap-[14px]">
    <section
      id="Informasi-Bantuan-Sosial"
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
            :src="socialAssistance?.thumbnail"
            class="w-full h-full object-cover"
            alt="photo"
          />
        </div>
        <div
          class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-soft-green"
          v-if="socialAssistance.is_available"
        >
          <span class="font-semibold text-xs text-white uppercase"
            >Tersedia</span
          >
        </div>
        <div
          class="badge rounded-full p-3 gap-2 flex justify-center shrink-0 bg-desa-red"
          v-if="!socialAssistance.is_available"
        >
          <span class="font-semibold text-xs text-white uppercase"
            >Tidak Tersedia</span
          >
        </div>
      </div>
      <div class="flex flex-col gap-[6px] w-full">
        <p class="font-semibold text-xl">{{ socialAssistance.name }}</p>
        <p class="flex items-center gap-1">
          <img
            src="@/assets/images/icons/profile-secondary-green.svg"
            class="flex size-[18px] shrink-0"
            alt="icon"
          />
          <span class="font-medium text-sm text-desa-secondary">{{
            socialAssistance.provider
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
            Rp.{{ formatRupiah(socialAssistance.amount) }}
          </p>
          <span class="font-medium text-desa-secondary"> Uang Tunai </span>
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
            {{ socialAssistance.social_assistance_recipients_count || 0 }} Warga
          </p>
          <span class="font-medium text-desa-secondary"> Total Pengajuan </span>
        </div>
      </div>
      <hr class="border-desa-foreshadow" />
      <div class="flex flex-col gap-3">
        <p class="font-medium text-sm text-desa-secondary">Tentang Bantuan</p>
        <p class="font-medium leading-8">
          {{ socialAssistance.description }}
        </p>
      </div>
    </section>
    <section
      id="Penerima-Bansos-Terakhir"
      class="flex flex-col flex-1 h-fit shrink-0 rounded-3xl p-6 gap-6 bg-white"
    >
      <p class="font-medium leading-5 text-desa-secondary">
        Penerima Bansos Terakhir
      </p>
      <div id="List-Bansos-Terkahir" class="flex flex-col gap-6">
        <div
          class="card flex flex-col rounded-2xl border border-desa-background p-4 gap-4"
          v-for="recipient in socialAssistance.social_assistance_recipients"
          :key="recipient.id"
        >
          <div class="flex items-center justify-between">
            <p class="font-medium text-sm text-desa-secondary">
              {{ formatToClientTimezone(recipient.created_at) }}
            </p>
            <img
              src="@/assets/images/icons/calendar-2-secondary-green.svg"
              class="flex size-[18px] shrink-0"
              alt="icon"
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
          <hr class="border-desa-background" />
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-0.5">
              <img
                src="@/assets/images/icons/profile-secondary-green.svg"
                class="flex size-[18px] shrink-0"
                alt="icon"
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
                  :src="recipient.head_of_family?.profile_picture"
                  class="w-full h-full object-cover"
                  alt="photo"
                />
              </div>
            </div>
          </div>
        </div>

        <a
          href="#"
          class="flex items-center justify-center h-14 rounded-2xl py-4 px-6 gap-[10px] bg-desa-dark-green"
        >
          <span class="font-medium leading-5 text-white">View All</span>
        </a>
      </div>
    </section>
  </div>
  <ModalDelete
    v-model="showModalDelete"
    title="Hapus Bantuan Sosial?"
    description="Tindakan ini permanen dan tidak bisa dibatalkan!"
    :loading="isDeleting"
    confirm-text="Iya Hapus"
    @confirm="handleDelete"
  />
</template>
