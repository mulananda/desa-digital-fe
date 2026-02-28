<!-- src/views/social-assistance/SocialAssistanceCreate.vue -->
<script setup lang="ts">
import { ref } from "vue";

import { useRouter } from "vue-router";
import { ROUTE_NAMES } from "@/config/routes.config";

import InputFile from "@/components/ui/InputFile.vue";
import Input from "@/components/ui/Input.vue";
import InputCurrency from "@/components/ui/InputCurrency.vue";
import Textarea from "@/components/ui/Textarea.vue";
import Button from "@/components/ui/Button.vue";

import IconEditSecondary from "@/assets/images/icons/edit-secondary-green.svg";
import IconEditBlack from "@/assets/images/icons/edit-black.svg";
import IconRpSquareSecondaryGreen from "@/assets/images/icons/rp-square-secondary-green.svg";
import IconRpSquareBlack from "@/assets/images/icons/rp-square-dark-green.svg";
import IconProfileSecondaryGreen from "@/assets/images/icons/user-secondary-green.svg";
import IconProfileBlack from "@/assets/images/icons/user-black.svg";
import IconBagSecondary from "@/assets/images/icons/bag-2-secondary-green.svg";
import IconBagDark from "@/assets/images/icons/bag-2-dark-green.svg";
import IconMoneySecondary from "@/assets/images/icons/money-secondary-green.svg";
import IconMoneyDark from "@/assets/images/icons/money-dark-green.svg";
import IconGasSecondary from "@/assets/images/icons/gas-station-secondary-green.svg";
import IconGasDark from "@/assets/images/icons/gas-station-dark-green.svg";
import IconHealthSecondary from "@/assets/images/icons/health-secondary-green.svg";
import IconHealthDark from "@/assets/images/icons/health-dark-green.svg";

import { useCreateSocialAssistance } from "@/composables/social-assistances/useCreateSocialAssistance";
import { useFormUX } from "@/utils/useFormUX";
import { validateWithZod } from "@/utils/validateWithZod";
import {
  socialAssistanceFormSchema,
  type SocialAssistanceCategory,
} from "@/schemas/social-assistance/socialAssistance.schema";
import { useSocialAssistanceForm } from "@/schemas/social-assistance/useSocialAssistanceForm";
import { extractBackendErrors } from "@/utils/extractBackendErrors";

const router = useRouter();

/* =========================
 * CONSTANTS
 * ========================= */
const CATEGORY_OPTIONS: Array<{
  value: SocialAssistanceCategory;
  label: string;
  icon: { inactive: string; active: string };
}> = [
  {
    value: "staple",
    label: "Bahan Pokok",
    icon: { inactive: IconBagSecondary, active: IconBagDark },
  },
  {
    value: "cash",
    label: "Uang Tunai",
    icon: { inactive: IconMoneySecondary, active: IconMoneyDark },
  },
  {
    value: "subsidized fuel",
    label: "BBM Subsidi",
    icon: { inactive: IconGasSecondary, active: IconGasDark },
  },
  {
    value: "health",
    label: "Kesehatan",
    icon: { inactive: IconHealthSecondary, active: IconHealthDark },
  },
];

const AVAILABILITY_OPTIONS = [
  {
    value: true,
    label: "Tersedia",
    icon: {
      inactive: "/src/assets/images/icons/tick-circle-secondary-green.svg",
      active: "/src/assets/images/icons/tick-circle-dark-green.svg",
    },
  },
  {
    value: false,
    label: "Tidak Tersedia",
    icon: {
      inactive: "/src/assets/images/icons/close-circle-secondary-green.svg",
      active: "/src/assets/images/icons/close-circle-dark-green.svg",
    },
  },
] as const;

/* =========================
 * COMPOSABLES
 * ========================= */
const {
  form,
  errors,
  previewUrl,
  setThumbnail,
  setErrors,
  clearFieldError,
  reset,
} = useSocialAssistanceForm();

const {
  mutate: submitSocialAssistance,
  isPending,
  isError,
  error,
} = useCreateSocialAssistance();

const { scrollToFirstError, focusFirstError } = useFormUX();

/* =========================
 * REFS
 * ========================= */
const inputFileRef = ref<InstanceType<typeof InputFile> | null>(null);

/* =========================
 * HANDLERS
 * ========================= */
async function handleSubmit() {
  // Step 1: Validasi frontend via Zod
  const result = validateWithZod(socialAssistanceFormSchema, form);

  if (!result.success) {
    setErrors(result.errors);
    scrollToFirstError(result.errors);
    focusFirstError(result.errors);
    return;
  }

  // Step 2: Submit ke backend
  try {
    await submitSocialAssistance(result.data);
    // onSuccess di composable sudah handle: invalidate + notif + redirect
    reset();
    if (inputFileRef.value?.fileInputRef) {
      inputFileRef.value.fileInputRef.value = "";
    }
  } catch (error: unknown) {
    // Step 3: Tangkap field errors 422 dari backend → inject ke form
    const backendErrors = extractBackendErrors(error);

    if (backendErrors) {
      setErrors(backendErrors);
      scrollToFirstError(backendErrors);
      focusFirstError(backendErrors);
    }
  }
}
</script>

<template>
  <!-- Breadcrumb -->
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
          Tambah bantuan sosial
        </span>
      </nav>
      <h1 class="font-semibold text-2xl">Tambah Bantuan Sosial</h1>
    </div>
  </div>

  <form
    @submit.prevent="handleSubmit"
    novalidate
    aria-label="Form tambah bantuan sosial"
    class="capitalize"
  >
    <div class="shrink-0 rounded-3xl p-6 bg-white flex flex-col gap-6 h-fit">
      <!-- Thumbnail -->
      <section
        aria-labelledby="label-thumbnail"
        class="flex items-center justify-between"
      >
        <h2
          id="label-thumbnail"
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Thumbnail Bantuan Sosial
        </h2>
        <div class="flex-1">
          <InputFile
            ref="inputFileRef"
            name="thumbnail"
            :model-value="form.thumbnail"
            :preview-url="previewUrl"
            :error-message="errors.thumbnail"
            @update:model-value="setThumbnail"
          />
        </div>
      </section>

      <hr class="border-desa-background" />

      <!-- Nama Bantuan Sosial -->
      <section
        aria-labelledby="label-name"
        class="flex items-center justify-between"
      >
        <p
          id="label-name"
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nama Bantuan Sosial
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <Input
            name="name"
            v-model="form.name"
            type="text"
            placeholder="Ketik Bantuan Sosial"
            :icon="IconEditSecondary"
            :filled-icon="IconEditBlack"
            :error-message="errors.name"
            @input="clearFieldError('name')"
          />
        </div>
      </section>

      <hr class="border-desa-background" />

      <!-- Kategori -->
      <section
        aria-labelledby="label-category"
        class="flex items-center justify-between"
      >
        <p
          id="label-category"
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Pilih Opsi Kategori
        </p>
        <div class="flex flex-col flex-1 shrink-0 gap-3">
          <div class="grid grid-cols-2 gap-6">
            <label
              v-for="category in CATEGORY_OPTIONS"
              :key="category.value"
              class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-0 has-[:checked]:bg-desa-foreshadow transition-setup cursor-pointer"
            >
              <input
                v-model="form.category"
                :value="category.value"
                type="radio"
                name="category"
                class="size-[18px] accent-desa-secondary checked:accent-desa-dark-green"
                @change="clearFieldError('category')"
              />
              <span
                class="font-medium leading-5 w-full text-desa-secondary group-has-[:checked]:text-desa-dark-green transition-setup"
              >
                {{ category.label }}
              </span>
              <div class="flex size-6 shrink-0" aria-hidden="true">
                <img
                  :src="category.icon.inactive"
                  class="size-6 group-has-[:checked]:hidden"
                  alt=""
                />
                <img
                  :src="category.icon.active"
                  class="size-6 hidden group-has-[:checked]:flex"
                  alt=""
                />
              </div>
            </label>
          </div>
          <span
            v-if="errors.category"
            role="alert"
            class="font-medium text-sm text-desa-red"
          >
            {{ errors.category }}
          </span>
        </div>
      </section>

      <hr class="border-desa-background" />

      <!-- Nominal -->
      <section
        aria-labelledby="label-amount"
        class="flex items-center justify-between"
      >
        <p
          id="label-amount"
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nominal Bantuan
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <InputCurrency
            name="amount"
            v-model="form.amount"
            placeholder="Ketik Nominal Bantuan"
            :icon="IconRpSquareSecondaryGreen"
            :filled-icon="IconRpSquareBlack"
            :error-message="errors.amount"
            :min="0"
            rupiah
            @input="clearFieldError('amount')"
          />
        </div>
      </section>

      <hr class="border-desa-background" />

      <!-- Provider -->
      <section
        aria-labelledby="label-provider"
        class="flex items-center justify-between"
      >
        <p
          id="label-provider"
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nama Pemberi Bantuan
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <Input
            name="provider"
            v-model="form.provider"
            type="text"
            placeholder="Ketik Pemberi Bantuan"
            :icon="IconProfileSecondaryGreen"
            :filled-icon="IconProfileBlack"
            :error-message="errors.provider"
            @input="clearFieldError('provider')"
          />
        </div>
      </section>

      <hr class="border-desa-background" />

      <!-- Deskripsi -->
      <section
        aria-labelledby="label-description"
        class="flex items-center justify-between"
      >
        <p
          id="label-description"
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Deskripsi Bantuan Sosial
        </p>
        <div class="flex-1 shrink-0">
          <Textarea
            name="description"
            v-model="form.description"
            placeholder="Jelaskan lebih detail tentang bantuan"
            :rows="6"
            :error-message="errors.description"
            @input="clearFieldError('description')"
          />
        </div>
      </section>

      <hr class="border-desa-background" />

      <!-- Ketersediaan -->
      <section
        aria-labelledby="label-availability"
        class="flex items-center justify-between"
      >
        <p
          id="label-availability"
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Pilih Opsi Ketersediaan
        </p>
        <div class="flex flex-1 gap-6 shrink-0">
          <label
            v-for="option in AVAILABILITY_OPTIONS"
            :key="String(option.value)"
            class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-0 has-[:checked]:bg-desa-foreshadow transition-setup cursor-pointer"
          >
            <input
              :checked="form.is_available === option.value"
              :value="option.value"
              type="radio"
              name="is_available"
              class="size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green"
              @change="form.is_available = option.value"
            />
            <span
              class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup"
            >
              {{ option.label }}
            </span>
            <div class="flex size-6 shrink-0" aria-hidden="true">
              <img
                :src="option.icon.inactive"
                class="size-6 group-has-[:checked]:hidden"
                alt=""
              />
              <img
                :src="option.icon.active"
                class="size-6 hidden group-has-[:checked]:flex"
                alt=""
              />
            </div>
          </label>
        </div>
        <span
          v-if="errors.is_available"
          role="alert"
          class="text-desa-red text-sm block"
        >
          {{ errors.is_available }}
        </span>
      </section>

      <hr class="border-desa-background w-[calc(100%+48px)] -mx-6" />

      <!-- Actions -->
      <section class="flex items-center justify-end gap-4">
        <button
          type="button"
          :disabled="isPending"
          class="py-[18px] rounded-2xl bg-desa-red w-[180px] text-center flex justify-center font-medium text-white disabled:opacity-60"
          @click="
            router.push({
              name: ROUTE_NAMES.SOCIAL_ASSISTANCE,
            })
          "
        >
          Batal, Tidak jadi
        </button>
        <Button
          type="submit"
          label="Buat Sekarang"
          :loading="isPending"
          :disabled="isPending"
          aria-label="Simpan bantuan sosial"
          class="py-[18px] rounded-2xl disabled:bg-desa-grey w-[180px] text-center flex justify-center font-medium text-white bg-desa-dark-green transition-all duration-300"
        />
      </section>
    </div>
  </form>
</template>
