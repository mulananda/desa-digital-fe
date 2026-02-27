// src/composables/development/useDevelopmentForm.ts

import { reactive, ref, watch, onBeforeUnmount } from "vue";
import dayjs from "dayjs";
import type { DevelopmentFormInput } from "@/schemas/development/development.schema";

type FormErrors = Partial<Record<keyof DevelopmentFormInput, string>>;

const DEFAULT_FORM: DevelopmentFormInput = {
  thumbnail: null,
  name: "",
  person_in_charge: "",
  description: "",
  start_date: "",
  end_date: "",
  days_needed: null,
  amount: "",
  status: "",
};

export const useDevelopmentForm = () => {
  const previewUrl = ref<string | null>(null);
  const form = reactive<DevelopmentFormInput>({ ...DEFAULT_FORM });
  const errors = reactive<FormErrors>({});

  /* =========================================================
   * AUTO-COMPUTE end_date
   *
   * Setiap kali start_date atau days_needed berubah,
   * end_date langsung dihitung ulang secara otomatis.
   *
   * Rumus:
   *   end_date = start_date + (days_needed - 1) hari
   *
   * Contoh:
   *   start_date  = "2024-01-01"
   *   days_needed = 30
   *   end_date    = "2024-01-30"
   *
   * Kenapa days_needed - 1?
   *   Hari pertama (start_date) sudah terhitung sebagai hari ke-1,
   *   sehingga kita hanya perlu menambah (days_needed - 1) hari ke depan.
   * ========================================================= */
  watch(
    () => [form.start_date, form.days_needed] as const,
    ([startDate, daysNeeded]) => {
      const isValid =
        !!startDate &&
        daysNeeded !== null &&
        daysNeeded !== undefined &&
        daysNeeded >= 1 &&
        dayjs(startDate).isValid();

      if (isValid) {
        form.end_date = dayjs(startDate)
          .add(daysNeeded! - 1, "day")
          .format("YYYY-MM-DD");

        // Hapus error end_date jika sudah terisi otomatis
        clearFieldError("end_date");
      } else {
        form.end_date = "";
      }
    },
  );

  /* =========================================================
   * THUMBNAIL
   * ========================================================= */
  function setThumbnail(file: File) {
    form.thumbnail = file;
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = URL.createObjectURL(file);
    clearFieldError("thumbnail");
  }

  /* =========================================================
   * ERRORS
   * ========================================================= */
  function setErrors(fieldErrors: Record<string, string>) {
    clearErrors();
    for (const [key, message] of Object.entries(fieldErrors)) {
      errors[key as keyof DevelopmentFormInput] = message;
    }
  }

  function clearErrors() {
    for (const key of Object.keys(errors) as Array<keyof FormErrors>) {
      delete errors[key];
    }
  }

  function clearFieldError(field: keyof DevelopmentFormInput) {
    delete errors[field];
  }

  /* =========================================================
   * RESET
   * ========================================================= */
  function reset() {
    Object.assign(form, { ...DEFAULT_FORM });
    clearErrors();
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }

  /* =========================================================
   * LIFECYCLE
   * ========================================================= */
  onBeforeUnmount(() => {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  });

  return {
    form,
    errors,
    previewUrl,
    setThumbnail,
    setErrors,
    clearErrors,
    clearFieldError,
    reset,
  };
};
