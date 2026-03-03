<!-- src/components/ui/TimePickerInput.vue -->
<script setup lang="ts">
import { computed, ref } from "vue";

interface Props {
  modelValue?: string | null;
  name?: string;
  placeholder?: string;
  errorMessage?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  name: "time",
  placeholder: "Pilih waktu",
  errorMessage: "",
  disabled: false,
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

/** Normalisasi "HH:mm:ss" → "HH:mm" agar cocok dengan input type="time" */
const normalizedValue = computed(() => {
  if (!props.modelValue) return "";
  return props.modelValue.slice(0, 5);
});

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

const inputRef = ref<HTMLInputElement | null>(null);

function openPicker() {
  if (props.disabled) return;
  const input = document.querySelector(
    `input[name="${props.name}"]`,
  ) as HTMLInputElement;
  input?.showPicker?.();
}
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <label class="relative group w-full">
      <!-- Input: hapus @click, biarkan native keyboard bekerja -->
      <input
        ref="inputRef"
        :name="name"
        type="time"
        :value="normalizedValue"
        :disabled="disabled"
        :class="inputClasses"
        @change="handleChange"
      />

      <!-- Icon: pindahkan @click ke sini sebagai trigger picker -->
      <div
        class="absolute transform -translate-y-1/2 top-1/2 left-4 flex size-6 shrink-0 cursor-pointer"
        aria-hidden="true"
        @click="openPicker"
      >
        <img
          src="@/assets/images/icons/timer-secondary-green.svg"
          class="size-6"
          :class="isEmpty ? 'flex' : 'hidden'"
          alt=""
        />
        <img
          src="@/assets/images/icons/timer-black.svg"
          class="size-6"
          :class="isEmpty ? 'hidden' : 'flex'"
          alt=""
        />
      </div>
    </label>

    <span v-if="errorMessage" role="alert" class="text-desa-red text-sm block">
      {{ errorMessage }}
    </span>
  </div>
</template>
