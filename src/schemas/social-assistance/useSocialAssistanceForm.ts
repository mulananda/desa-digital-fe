// src/composables/social-assistance/useSocialAssistanceForm.ts
import { reactive, ref, onBeforeUnmount } from "vue";
import type { SocialAssistanceFormInput } from "@/schemas/social-assistance/socialAssistance.schema";

type FormErrors = Partial<Record<keyof SocialAssistanceFormInput, string>>;

const DEFAULT_FORM: SocialAssistanceFormInput = {
  thumbnail: null as any,
  name: "",
  category: "",
  amount: "",
  provider: "",
  description: "",
  is_available: true,
};

export const useSocialAssistanceForm = () => {
  const previewUrl = ref<string | null>(null);
  const form = reactive<SocialAssistanceFormInput>({ ...DEFAULT_FORM });
  const errors = reactive<FormErrors>({});

  function setThumbnail(file: File) {
    form.thumbnail = file;
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = URL.createObjectURL(file);
    clearFieldError("thumbnail");
  }

  // Disesuaikan dengan return type validateWithZod → Record<string, string>
  function setErrors(fieldErrors: Record<string, string>) {
    clearErrors();
    for (const [key, message] of Object.entries(fieldErrors)) {
      errors[key as keyof SocialAssistanceFormInput] = message;
    }
  }

  function clearErrors() {
    for (const key of Object.keys(errors) as Array<keyof FormErrors>) {
      delete errors[key];
    }
  }

  function clearFieldError(field: keyof SocialAssistanceFormInput) {
    delete errors[field];
  }

  function reset() {
    Object.assign(form, { ...DEFAULT_FORM });
    clearErrors();
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }

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
