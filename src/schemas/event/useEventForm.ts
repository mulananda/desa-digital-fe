// src/composables/development/useEventForm.ts

import { reactive, ref, onBeforeUnmount } from "vue";
import { EventFormInput } from "./event.schema";

type FormErrors = Partial<Record<keyof EventFormInput, string>>;

const DEFAULT_FORM: EventFormInput = {
  thumbnail: null,
  name: "",
  description: "",
  price: "",
  date: "",
  time: "",
  is_active: true,
};

export const useEventForm = () => {
  const previewUrl = ref<string | null>(null);
  const form = reactive<EventFormInput>({ ...DEFAULT_FORM });
  const errors = reactive<FormErrors>({});

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
      errors[key as keyof EventFormInput] = message;
    }
  }

  function clearErrors() {
    for (const key of Object.keys(errors) as Array<keyof FormErrors>) {
      delete errors[key];
    }
  }

  function clearFieldError(field: keyof EventFormInput) {
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
