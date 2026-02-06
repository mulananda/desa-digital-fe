<!-- src/views/social-assistance/SocialAssistanceEdit.vue -->
<script setup>
/* =========================
 * IMPORTS
 * ========================= */
import { ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { useSocialAssistanceStore } from "@/stores/socialAssistance";
import { ROUTE_NAMES } from "@/config/routes.config";

import Input from "@/components/ui/Input.vue";
import InputNumber from "@/components/ui/InputNumber.vue";
import Button from "@/components/ui/Button.vue";

import { scrollToFirstError } from "@/utils/scrollToFirstError";

/* icons */
import IconEditSecondary from "@/assets/images/icons/edit-secondary-green.svg";
import IconEditBlack from "@/assets/images/icons/edit-black.svg";
import IconRpSquareSecondaryGreen from "@/assets/images/icons/rp-square-secondary-green.svg";
import IconRpSquareBlack from "@/assets/images/icons/rp-square-black.svg";
import IconProfileSecondaryGreen from "@/assets/images/icons/user-secondary-green.svg";
import IconProfileBlack from "@/assets/images/icons/user-black.svg";
import IconBagSecondary from "@/assets/images/icons/bag-2-secondary-green.svg";
import IconBagDark from "@/assets/images/icons/bag-2-dark-green.svg";

import IconMoneySecondary from "@/assets/images/icons/money-secondary-green.svg";
import IconMoneyDark from "@/assets/images/icons/money-dark-green.svg";

import IconGasSecondary from "@/assets/images/icons/gas-station-secondary-green.svg";
import IconGasDark from "@/assets/images/icons/gas-station-dark-green.svg";

import IconHealthSecondary from "@/assets/images/icons/health-secondary-green.svg";
import IconHealthDark from "@/assets/images/icons/health-secondary-green.svg";

import defaultPhoto from "@/assets/images/thumbnails/thumbnail-bansos-preview.svg";

/* =========================
 * ROUTER & STORE
 * ========================= */
const router = useRouter();

const socialAssistanceStore = useSocialAssistanceStore();
const { loading, error } = storeToRefs(socialAssistanceStore);
const { createSocialAssistance } = socialAssistanceStore;

/* =========================
 * CONSTANTS
 * ========================= */
const CATEGORY_OPTIONS = [
  {
    value: "staple",
    label: "Bahan Pokok",
    icon: {
      inactive: IconBagSecondary,
      active: IconBagDark,
    },
  },
  {
    value: "cash",
    label: "Uang Tunai",
    icon: {
      inactive: IconMoneySecondary,
      active: IconMoneyDark,
    },
  },
  {
    value: "subsidized fuel",
    label: "BBM Subsidi",
    icon: {
      inactive: IconGasSecondary,
      active: IconGasDark,
    },
  },
  {
    value: "health",
    label: "Kesehatan",
    icon: {
      inactive: IconHealthSecondary,
      active: IconHealthDark,
    },
  },
];

/* =========================
 * STATE
 * ========================= */
const socialAssistance = ref(createEmptyForm());
const thumbnailRef = ref(null);

/* =========================
 * FACTORIES & NORMALIZER
 * ========================= */
function createEmptyForm() {
  return {
    id: null,
    thumbnail: null,
    thumbnail_url: null,
    name: "",
    category: "",
    amount: null,
    provider: "",
    description: "",
    is_available: true,
  };
}

/* =========================
 * HANDLERS
 * ========================= */
function handleImageChange(event) {
  const file = event.target?.files?.[0];
  if (!file || !file.type.startsWith("image/")) return;

  if (socialAssistance.value.thumbnail_url) {
    URL.revokeObjectURL(socialAssistance.value.thumbnail_url);
  }

  socialAssistance.value.thumbnail = file;
  socialAssistance.value.thumbnail_url = URL.createObjectURL(file);
}

async function handleSubmit() {
  const payload = {
    ...socialAssistance.value,
    is_available: socialAssistance.value.is_available ? 1 : 0,
  };

  await createSocialAssistance(payload);

  if (error.value) {
    scrollToFirstError(error.value);
    return;
  }

  router.push({
    name: ROUTE_NAMES.SOCIAL_ASSISTANCE,
  });
}
</script>

<template>
  <div id="Header" class="flex items-center justify-between">
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
          tambah bantuan sosial
        </p>
      </div>
      <h1 class="font-semibold text-2xl">Tambah Bantuan Sosial</h1>
    </div>
  </div>
  <form @submit.prevent="handleSubmit" id="myForm" class="capitalize">
    <div class="shrink-0 rounded-3xl p-6 bg-white flex flex-col gap-6 h-fit">
      <section id="Thumbnail" class="flex items-center justify-between">
        <h2
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Thumbnail Bantuan Sosial
        </h2>
        <div class="flex-1 flex items-center justify-between">
          <div
            id="Photo-Preview"
            class="flex itce justify-center w-[120px] h-[100px] rounded-2xl overflow-hidden bg-desa-foreshadow"
          >
            <img
              id="Photo"
              :src="
                socialAssistance.thumbnail_url
                  ? socialAssistance.thumbnail_url
                  : defaultPhoto
              "
              alt="image"
              class="size-full object-cover"
            />
          </div>
          <div class="relative">
            <input
              id="File"
              type="file"
              name="file"
              class="absolute opacity-0 left-0 w-full top-0 h-full"
              @change="handleImageChange"
              ref="thumbnailRef"
            />
            <button
              id="Upload"
              type="button"
              class="relative flex items-center py-4 px-6 rounded-2xl bg-desa-black gap-[10px]"
              @click="thumbnailRef?.click()"
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
      </section>
      <hr class="border-desa-background" />
      <section
        id="Nama-Bantuan-Sosial"
        class="flex items-center justify-between"
      >
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nama Bantuan Sosial
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <label class="relative group peer w-full">
            <Input
              v-model="socialAssistance.name"
              type="text"
              placeholder="Ketik Bantuan Sosial"
              :icon="IconEditSecondary"
              :filled-icon="IconEditBlack"
              :error-message="error?.name"
            />
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Kategori" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Pilih Opsi Kategori
        </p>
        <div class="grid grid-cols-2 flex-1 gap-6 shrink-0">
          <label
            v-for="category in CATEGORY_OPTIONS"
            :key="category.value"
            class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-none has-[:checked]:bg-desa-foreshadow transition-setup"
          >
            <input
              v-model="socialAssistance.category"
              :value="category.value"
              type="radio"
              name="category"
              class="size-[18px] accent-desa-secondary checked:accent-desa-dark-green"
            />

            <span
              class="font-medium leading-5 w-full text-desa-secondary group-has-[:checked]:text-desa-dark-green transition-setup"
            >
              {{ category.label }}
            </span>

            <div class="flex size-6 shrink-0">
              <img
                :src="category.icon.inactive"
                class="size-6 group-has-[:checked]:hidden"
                alt="icon"
              />
              <img
                :src="category.icon.active"
                class="size-6 hidden group-has-[:checked]:flex"
                alt="icon"
              />
            </div>
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Nominal Bantuan" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nominal Bantuan
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <label class="relative group peer w-full">
            <InputNumber
              v-model="socialAssistance.amount"
              placeholder="Ketik Nominal Bantuan"
              :icon="IconRpSquareSecondaryGreen"
              :filled-icon="IconRpSquareBlack"
              :error-message="error?.amount"
              :min="0"
            />
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section
        id="Nama-Pemberi-Bantuan"
        class="flex items-center justify-between"
      >
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nama Pemberi Bantuan
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <label class="relative group peer w-full">
            <Input
              v-model="socialAssistance.provider"
              type="text"
              placeholder="Ketik Pemberi Bantuan"
              :icon="IconProfileSecondaryGreen"
              :filled-icon="IconProfileBlack"
              :error-message="error?.provider"
            />
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Deskripsi" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Deskripsi Bantuan Sosial
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <textarea
            v-model="socialAssistance.description"
            name=""
            id=""
            placeholder="Jelaskan lebih detail tentang bantuan"
            rows="6"
            class="appearance-none outline-none w-full rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 px-4 gap-2 font-medium placeholder:text-desa-secondary transition-all duration-300"
          ></textarea>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Ketersediaan" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Pilih Opsi Ketersediaan
        </p>
        <div class="flex flex-1 gap-6 shrink-0">
          <label
            class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-none has-[:checked]:bg-desa-foreshadow transition-setup"
          >
            <input
              v-model="socialAssistance.is_available"
              :value="true"
              type="radio"
              id=""
              class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup"
            />
            <span
              class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup"
            >
              Tersedia
            </span>
            <div class="flex size-6 shrink-0">
              <img
                src="@/assets/images/icons/tick-circle-secondary-green.svg"
                class="size-6 flex group-has-[:checked]:hidden"
                alt="icon"
              />
              <img
                src="@/assets/images/icons/tick-circle-dark-green.svg"
                class="size-6 hidden group-has-[:checked]:flex"
                alt="icon"
              />
            </div>
          </label>
          <label
            class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-none has-[:checked]:bg-desa-foreshadow transition-setup"
          >
            <input
              v-model="socialAssistance.is_available"
              :value="false"
              type="radio"
              id=""
              class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup"
            />
            <span
              class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup"
            >
              Tidak Tersedia
            </span>
            <div class="flex size-6 shrink-0">
              <img
                src="@/assets/images/icons/close-circle-secondary-green.svg"
                class="size-6 flex group-has-[:checked]:hidden"
                alt="icon"
              />
              <img
                src="@/assets/images/icons/close-circle-secondary-green.svg"
                class="size-6 hidden group-has-[:checked]:flex"
                alt="icon"
              />
            </div>
          </label>
        </div>
      </section>
      <hr class="border-desa-background w-[calc(100%+48px)] -mx-6" />
      <section id="Buttons" class="flex items-center justify-end gap-4">
        <RouterLink
          :to="{
            name: ROUTE_NAMES.SOCIAL_ASSISTANCE,
          }"
        >
          <div
            class="py-[18px] rounded-2xl bg-desa-red w-[180px] text-center flex justify-center font-medium text-white"
          >
            Batal, Tidak jadi
          </div>
        </RouterLink>
        <Button
          type="submit"
          label="Create Now"
          :loading="loading"
          :disabled="loading"
          aria-label="Membuat Akun .."
          class="py-[18px] rounded-2xl disabled:bg-desa-grey w-[180px] text-center flex justify-center font-medium text-white bg-desa-dark-green transition-all duration-300"
        />
      </section>
    </div>
  </form>
</template>
