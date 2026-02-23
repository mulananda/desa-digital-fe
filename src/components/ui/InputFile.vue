<!-- src/components/ui/InputFile.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  modelValue: File | null;
  accept?: string;
  errorMessage?: string;
  previewUrl?: string | null;
  uploadLabel?: string;
  changeLabel?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [file: File];
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);

const DEFAULT_THUMBNAIL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

const imageSrc = computed(() => props.previewUrl ?? DEFAULT_THUMBNAIL);
const buttonLabel = computed(() =>
  props.modelValue
    ? (props.changeLabel ?? "Ganti Gambar")
    : (props.uploadLabel ?? "Upload"),
);

function openFilePicker() {
  fileInputRef.value?.click();
}

function handleChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  emit("update:modelValue", file);
}

// Expose ref agar parent bisa reset: fileInputRef.value.value = ""
defineExpose({ fileInputRef });
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <!-- Preview -->
      <div
        class="flex items-center justify-center w-[120px] h-[100px] rounded-2xl overflow-hidden bg-desa-foreshadow shrink-0"
      >
        <img
          :src="imageSrc"
          alt="Preview thumbnail"
          class="size-full object-cover"
        />
      </div>

      <!-- Upload Button -->
      <div>
        <input
          ref="fileInputRef"
          type="file"
          :accept="accept ?? 'image/jpeg,image/jpg,image/png,image/webp'"
          class="hidden"
          tabindex="-1"
          aria-hidden="true"
          @change="handleChange"
        />
        <button
          type="button"
          class="flex items-center py-4 px-6 rounded-2xl bg-desa-black gap-[10px]"
          @click="openFilePicker"
        >
          <img
            src="@/assets/images/icons/send-square-white.svg"
            alt=""
            aria-hidden="true"
            class="size-6 shrink-0"
          />
          <span class="font-medium leading-5 text-white">{{
            buttonLabel
          }}</span>
        </button>
      </div>
    </div>

    <span
      v-if="errorMessage"
      role="alert"
      class="font-medium text-sm text-desa-red"
    >
      {{ errorMessage }}
    </span>
  </div>
</template>
