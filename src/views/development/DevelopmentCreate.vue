<!-- src/views/development/DevelopmentEdit.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";

import { ROUTE_NAMES } from "@/config/routes.config";

import InputFile from "@/components/ui/InputFile.vue";
import Input from "@/components/ui/Input.vue";
import InputCurrency from "@/components/ui/InputCurrency.vue";
import DatePickerInput from "@/components/ui/DatePickerInput.vue";
import InputNumber from "@/components/ui/InputNumber.vue";
import Textarea from "@/components/ui/Textarea.vue";

import IconEditSecondary from "@/assets/images/icons/edit-secondary-green.svg";
import IconEditBlack from "@/assets/images/icons/edit-black.svg";
import IconRpSquareSecondaryGreen from "@/assets/images/icons/rp-square-secondary-green.svg";
import IconRpSquareBlack from "@/assets/images/icons/rp-square-dark-green.svg";
import IconProfile from "@/assets/images/icons/profile-circle-secondary-green.svg";
import IconEditProfile from "@/assets/images/icons/profile-circle-black.svg";
import IconTimer from "@/assets/images/icons/timer-secondary-green.svg";
import IconTimerBlack from "@/assets/images/icons/timer-black.svg";

import { useCreateDevelopment } from "@/composables/development/useCreateDevelopment";
import { useFormUX } from "@/utils/useFormUX";
import { validateWithZod } from "@/utils/validateWithZod";
import {
  developmentFormSchema,
  type DevelopmentStatus,
} from "@/schemas/development/development.schema";
import { useDevelopmentForm } from "@/schemas/development/useDevelopemtForm";
import { extractBackendErrors } from "@/utils/extractBackendErrors";

/* =========================================================
 * ROUTE
 * ========================================================= */
const router = useRouter();

/* =========================
 * CONSTANTS
 * ========================= */
const STATUS_OPTIONS: Array<{
  value: DevelopmentStatus;
  label: string;
  icon: { inactive: string; active: string };
}> = [
  {
    value: "ongoing",
    label: "On Going",
    icon: {
      inactive: "/src/assets/images/icons/tick-circle-secondary-green.svg",
      active: "/src/assets/images/icons/tick-circle-dark-green.svg",
    },
  },
  {
    value: "completed",
    label: "Completed",
    icon: {
      inactive: "/src/assets/images/icons/close-circle-secondary-green.svg",
      active: "/src/assets/images/icons/close-circle-dark-green.svg",
    },
  },
];

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
} = useDevelopmentForm();

const {
  mutate: submitDevelopment,
  isPending,
  isError,
  error,
} = useCreateDevelopment();

const { scrollToFirstError, focusFirstError } = useFormUX();

/* =========================
 * REFS
 * ========================= */
const inputFileRef = ref<InstanceType<typeof InputFile> | null>(null);

/* =========================================================
 * HANDLERS
 * ========================================================= */
async function handleSubmit() {
  // Step 1: Validasi frontend via Zod
  const result = validateWithZod(developmentFormSchema, form);

  if (!result.success) {
    setErrors(result.errors);
    scrollToFirstError(result.errors);
    focusFirstError(result.errors);
    return;
  }
  // Step 2: Submit ke backend
  try {
    await submitDevelopment(result.data);
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
  <div id="Header" class="flex items-center justify-between">
    <div class="flex flex-col gap-2">
      <div class="flex gap-1 items-center leading-5 text-desa-secondary">
        <p
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Pembangunan Desa
        </p>
        <span>/</span>
        <p
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Edit Pembangunan Desa
        </p>
      </div>
      <h1 class="font-semibold text-2xl">Edit Pembangunan Desa</h1>
    </div>
  </div>
  <form
    @submit.prevent="handleSubmit"
    novalidate
    aria-label="Form tambah bantuan sosial"
    class="capitalize"
  >
    <!-- Thumbnail -->
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
          Thumbnail Event Terkait
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

      <!-- Nama Projek Pembangunan -->
      <section
        aria-labelledby="label-name"
        class="flex items-center justify-between"
      >
        <p
          id="label-name"
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nama Projek Pembangunan
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <Input
            name="name"
            v-model="form.name"
            type="text"
            placeholder="Ketik Judul Projek Pembangunan"
            :icon="IconEditSecondary"
            :filled-icon="IconEditBlack"
            :error-message="errors.name"
            @input="clearFieldError('name')"
          />
        </div>
      </section>
      <hr class="border-desa-background" />

      <!-- Penanggung jawab -->
      <section
        aria-labelledby="label-name"
        class="flex items-center justify-between"
      >
        <p
          id="label-name"
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Penanggung Jawab
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <Input
            name="person_in_charge"
            v-model="form.person_in_charge"
            type="text"
            placeholder="Ketik nama penanggung jawab"
            :icon="IconProfile"
            :filled-icon="IconEditProfile"
            :error-message="errors.person_in_charge"
            @input="clearFieldError('person_in_charge')"
          />
        </div>
      </section>
      <hr class="border-desa-background" />

      <!-- Status -->
      <section
        aria-labelledby="label-category"
        class="flex items-center justify-between"
      >
        <p
          id="label-category"
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Pilih Status Pembangunan
        </p>
        <div class="flex flex-col flex-1 shrink-0 gap-3">
          <div class="grid grid-cols-2 gap-6">
            <label
              v-for="status in STATUS_OPTIONS"
              :key="status.value"
              class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] gap-2 has-[:checked]:ring-0 has-[:checked]:bg-desa-foreshadow transition-setup cursor-pointer"
              :class="errors.status ? 'ring-red-500' : 'ring-desa-background'"
            >
              <input
                v-model="form.status"
                :value="status.value"
                type="radio"
                name="status"
                class="size-[18px] accent-desa-secondary checked:accent-desa-dark-green"
                @change="clearFieldError('status')"
              />
              <span
                class="font-medium leading-5 w-full text-desa-secondary group-has-[:checked]:text-desa-dark-green transition-setup"
              >
                {{ status.label }}
              </span>
              <div class="flex size-6 shrink-0" aria-hidden="true">
                <img
                  :src="status.icon.inactive"
                  class="size-6 group-has-[:checked]:hidden"
                  alt=""
                />
                <img
                  :src="status.icon.active"
                  class="size-6 hidden group-has-[:checked]:flex"
                  alt=""
                />
              </div>
            </label>
          </div>
          <span
            v-if="errors.status"
            role="alert"
            class="text-desa-red text-sm block"
          >
            {{ errors.status }}
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

      <!-- Tanggal Pembangunan -->
      <section
        id="Tanggal-Pembangunan"
        class="flex items-center justify-between"
      >
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Tanggal Pembangunan
        </p>
        <div class="flex-1 shrink-0">
          <DatePickerInput
            name="start_date"
            v-model="form.start_date"
            :error-message="errors.start_date"
            @change="clearFieldError('start_date')"
          />
        </div>
      </section>
      <hr class="border-desa-background" />

      <!-- Hari Yang Dibutuhkan -->
      <section
        aria-labelledby="label-days"
        class="flex items-center justify-between"
      >
        <p
          id="label-days"
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Hari Yang Dibutuhkan
        </p>
        <div class="flex-1 shrink-0">
          <InputNumber
            name="days_needed"
            v-model="form.days_needed"
            placeholder="Ketik hari yang dibutuhkan"
            suffix="Hari"
            :icon="IconTimer"
            :filled-icon="IconTimerBlack"
            :error-message="errors.days_needed"
            :min="1"
            @input="clearFieldError('days_needed')"
          />
        </div>
      </section>
      <hr class="border-desa-background" />

      <!-- Deskripsi Pembangunan -->
      <section
        aria-labelledby="label-description"
        class="flex items-center justify-between"
      >
        <p
          id="label-description"
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Deskripsi Pembangunan
        </p>
        <div class="flex-1 shrink-0">
          <Textarea
            name="description"
            v-model="form.description"
            placeholder="Jelaskan lebih detail tentang pembangunan"
            :rows="6"
            :error-message="errors.description"
            @input="clearFieldError('description')"
          />
        </div>
      </section>
      <hr class="border-desa-background w-[calc(100%+48px)] -mx-6" />

      <section id="Buttons" class="flex items-center justify-end gap-4">
        <button
          type="button"
          :disabled="isPending"
          class="py-[18px] rounded-2xl bg-desa-red w-[180px] text-center flex justify-center font-medium text-white disabled:opacity-60"
          @click="
            router.push({
              name: ROUTE_NAMES.DEVELOPMENT,
            })
          "
        >
          Batal, Tidak jadi
        </button>
        <button
          id="submitButton"
          type="submit"
          :disabled="isPending"
          class="py-[18px] rounded-2xl disabled:bg-desa-grey w-[180px] text-center flex justify-center font-medium text-white bg-desa-dark-green transition-all duration-300"
        >
          {{ isPending ? "Menyimpan..." : "Save Changes" }}
        </button>
      </section>
    </div>
  </form>
</template>
