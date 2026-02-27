<!-- src/components/ui/DatePickerInput.vue -->
<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue?: string | null;
  name?: string;
  placeholder?: string;
  errorMessage?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  name: "date",
  placeholder: "Pilih tanggal",
  errorMessage: "",
  disabled: false,
  min: "",
  max: "",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
}>();

/* =========================================================
 * COMPUTED
 * ========================================================= */

/** True jika belum ada nilai (input kosong) */
const isEmpty = computed(() => !props.modelValue);

const inputClasses = computed(() => [
  "appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] p-4 pl-12 gap-2 font-medium transition-all duration-300",
  "[&::-webkit-calendar-picker-indicator]:hidden",
  "cursor-pointer",
  props.disabled ? "bg-desa-background cursor-not-allowed opacity-60" : "",
  props.errorMessage
    ? "ring-red-500 focus:ring-red-500"
    : "ring-desa-background focus:ring-desa-black",
  isEmpty.value ? "text-desa-secondary" : "text-desa-black",
]);

/* =========================================================
 * HANDLERS
 * ========================================================= */
function handleChange(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  emit("update:modelValue", value);
  emit("change", value);
}

function openPicker(event: MouseEvent) {
  if (props.disabled) return;
  (event.currentTarget as HTMLInputElement).showPicker?.();
}
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <label class="relative group w-full">
      <!-- Input -->
      <input
        :name="name"
        type="date"
        :value="modelValue ?? ''"
        :min="min"
        :max="max"
        :disabled="disabled"
        :class="inputClasses"
        @change="handleChange"
        @click="openPicker"
      />

      <!-- Icon calendar: secondary-green saat kosong, black saat terisi -->
      <div
        class="absolute transform -translate-y-1/2 top-1/2 left-4 flex size-6 shrink-0 pointer-events-none"
        aria-hidden="true"
      >
        <!-- Icon saat kosong (secondary-green) -->
        <img
          src="@/assets/images/icons/calendar-2-secondary-green.svg"
          class="size-6"
          :class="isEmpty ? 'flex' : 'hidden'"
          alt=""
        />
        <!-- Icon saat terisi (black) -->
        <img
          src="@/assets/images/icons/calendar-2-black.svg"
          class="size-6"
          :class="isEmpty ? 'hidden' : 'flex'"
          alt=""
        />
      </div>
    </label>

    <!-- Error message -->
    <span v-if="errorMessage" role="alert" class="text-desa-red text-sm block">
      {{ errorMessage }}
    </span>
  </div>
</template>
