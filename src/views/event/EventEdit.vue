<!-- src/views/development/DevelopmentEdit.vue -->
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { ROUTE_NAMES } from "@/config/routes.config";

import InputFile from "@/components/ui/InputFile.vue";
import DatePickerInput from "@/components/ui/DatePickerInput.vue";
import InputCurrency from "@/components/ui/InputCurrency.vue";
import Textarea from "@/components/ui/Textarea.vue";
import Input from "@/components/ui/Input.vue";
import TimePickerInput from "@/components/ui/TimePickerInput.vue";

import IconEditSecondary from "@/assets/images/icons/edit-secondary-green.svg";
import IconEditBlack from "@/assets/images/icons/edit-black.svg";
import IconRpSquareSecondaryGreen from "@/assets/images/icons/rp-square-secondary-green.svg";
import IconRpSquareBlack from "@/assets/images/icons/rp-square-dark-green.svg";

// import { useDevelopmentForm } from "@/schemas/development/useDevelopemtForm";
// import { useDevelopment } from "@/composables/development/useDevelopment";
// import { useUpdateDevelopment } from "@/composables/development/useUpdateDevelopment";
import { useFormUX } from "@/utils/useFormUX";
import { validateWithZod } from "@/utils/validateWithZod";
import { extractBackendErrors } from "@/utils/extractBackendErrors";
// import {
//   developmentUpdateSchema,
//   type DevelopmentStatus,
// } from "@/schemas/development/development.schema";
import { useEventForm } from "@/schemas/event/useEventForm";
import { useEvent } from "@/composables/event/useEvent";
import { parseRupiah } from "@/helpers/format";
import { useUpdateEvent } from "@/composables/event/useUpdateEvent";
import { eventUpdateSchema } from "@/schemas/event/event.schema";

/* =========================================================
 * ROUTE
 * ========================================================= */
const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

/* =========================
 * CONSTANTS
 * ========================= */

const STATUS_OPTIONS = [
  {
    value: true,
    label: "Open",
    icon: {
      inactive: "/src/assets/images/icons/tick-circle-secondary-green.svg",
      active: "/src/assets/images/icons/tick-circle-dark-green.svg",
    },
  },
  {
    value: false,
    label: "Closed",
    icon: {
      inactive: "/src/assets/images/icons/close-circle-secondary-green.svg",
      active: "/src/assets/images/icons/close-circle-dark-green.svg",
    },
  },
] as const;

/* =========================
 * COMPOSABLES
 * ========================= */
const { event, isPending: isFetching } = useEvent(id);

const { form, errors, previewUrl, setThumbnail, setErrors, clearFieldError } =
  useEventForm();

const { mutate: submitUpdate, isPending: isSubmitting } = useUpdateEvent(id);

const { scrollToFirstError, focusFirstError } = useFormUX();

/* =========================
 * POPULATE FORM dari data existing
 * ========================= */
watch(
  event,
  (data) => {
    if (!data) return;

    form.name = data.name;
    form.is_active = data.is_active;
    form.price = parseRupiah(data.price);
    form.date = data.date;
    form.time = data.time;
    form.description = data.description;

    // thumbnail tidak di-populate — user harus upload baru jika mau ganti
  },
  { immediate: true },
);

/* =========================
 * COMPUTED thumbnail preview
 * existing thumbnail dari server (URL string)
 * ========================= */
const existingThumbnailUrl = computed(
  () => previewUrl.value ?? event.value?.thumbnail ?? null,
);

/* =========================================================
 * HANDLERS
 * ========================================================= */
async function handleSubmit() {
  const result = validateWithZod(eventUpdateSchema, form);

  if (!result.success) {
    setErrors(result.errors);
    scrollToFirstError(result.errors);
    focusFirstError(result.errors);
    return;
  }

  try {
    await submitUpdate(result.data);
  } catch (error: unknown) {
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
          Event Desa
        </p>
        <span>/</span>
        <p
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Edit Event Desa
        </p>
      </div>
      <h1 class="font-semibold text-2xl">Edit Event Desa</h1>
    </div>
  </div>
  <form id="myForm" class="capitalize" @submit.prevent="handleSubmit">
    <div class="shrink-0 rounded-3xl p-6 bg-white flex flex-col gap-6 h-fit">
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
            :preview-url="existingThumbnailUrl"
            :error-message="errors.thumbnail"
            upload-label="Ganti Thumbnail"
            change-label="Ganti Thumbnail"
            @update:model-value="setThumbnail"
          />
        </div>
      </section>
      <hr class="border-desa-background" />

      <!-- Nama -->
      <section
        aria-labelledby="label-name"
        class="flex items-center justify-between"
      >
        <p
          id="label-name"
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nama Event
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <Input
            name="name"
            v-model="form.name"
            type="text"
            placeholder="Ketik nama event"
            :icon="IconEditSecondary"
            :filled-icon="IconEditBlack"
            :error-message="errors.name"
            @input="clearFieldError('name')"
          />
        </div>
      </section>
      <hr class="border-desa-background" />

      <!-- Status Event -->
      <section
        aria-labelledby="label-availability"
        class="flex items-center justify-between"
      >
        <p
          id="label-availability"
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Pilih Status Event
        </p>
        <div class="flex flex-1 gap-6 shrink-0">
          <label
            v-for="option in STATUS_OPTIONS"
            :key="String(option.value)"
            class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-0 has-[:checked]:bg-desa-foreshadow transition-setup cursor-pointer"
          >
            <input
              :checked="form.is_active === option.value"
              :value="option.value"
              type="radio"
              name="is_active"
              class="size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green"
              @change="form.is_active = option.value"
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
      </section>

      <hr class="border-desa-background" />

      <!-- Nominal -->
      <section
        aria-labelledby="label-price"
        class="flex items-center justify-between"
      >
        <p
          id="label-price"
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Harga Event
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <InputCurrency
            name="price"
            v-model="form.price"
            placeholder="Ketik Total Harga event"
            :icon="IconRpSquareSecondaryGreen"
            :filled-icon="IconRpSquareBlack"
            :error-message="errors.price"
            :min="0"
            rupiah
            @input="clearFieldError('price')"
          />
        </div>
      </section>

      <hr class="border-desa-background" />

      <!-- Tanggal Event -->
      <section id="Tanggal-Event" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Tanggal Event Dilakukan
        </p>
        <div class="flex-1 shrink-0">
          <DatePickerInput
            name="date"
            v-model="form.date"
            :error-message="errors.date"
            @change="clearFieldError('date')"
          />
        </div>
      </section>
      <hr class="border-desa-background" />

      <!-- Waktu Event Dilakukan -->
      <section
        aria-labelledby="label-days"
        class="flex items-center justify-between"
      >
        <p
          id="label-days"
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Waktu Event Dilakukan
        </p>
        <div class="flex-1 shrink-0">
          <TimePickerInput
            v-model="form.time"
            name="time"
            placeholder="Pilih waktu"
            :error-message="errors.time"
            @input="clearFieldError('time')"
          />
        </div>
      </section>
      <hr class="border-desa-background" />

      <!-- Deskripsi Event -->
      <section
        aria-labelledby="label-description"
        class="flex items-center justify-between"
      >
        <p
          id="label-description"
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Deskripsi Event Terkait
        </p>
        <div class="flex-1 shrink-0">
          <Textarea
            name="description"
            v-model="form.description"
            placeholder="Jelaskan lebih detail tentang Event"
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
          :disabled="isSubmitting"
          class="py-[18px] rounded-2xl bg-desa-red w-[180px] text-center flex justify-center font-medium text-white disabled:opacity-60"
          @click="
            router.push({
              name: ROUTE_NAMES.MANAGE_EVENT,
              params: { id: event.id },
            })
          "
        >
          Batal, Tidak jadi
        </button>
        <button
          id="submitButton"
          type="submit"
          :disabled="isSubmitting || isFetching"
          class="py-[18px] rounded-2xl disabled:bg-desa-grey w-[180px] text-center flex justify-center font-medium text-white bg-desa-dark-green transition-all duration-300"
        >
          {{ isSubmitting ? "Menyimpan..." : "Save Changes" }}
        </button>
      </section>
    </div>
  </form>
</template>
