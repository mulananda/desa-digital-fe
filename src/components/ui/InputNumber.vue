<!-- src/components/ui/InputNumber.vue -->
<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue?: number | null;
  name?: string;
  placeholder?: string;
  errorMessage?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  icon?: string;
  filledIcon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  name: "number",
  placeholder: "Ketik angka",
  errorMessage: "",
  disabled: false,
  min: undefined,
  max: undefined,
  step: 1,
  suffix: "",
  icon: "",
  filledIcon: "",
});

const emit = defineEmits<{
  "update:modelValue": [value: number | null];
  change: [value: number | null];
  input: [value: number | null];
}>();

/* =========================================================
 * COMPUTED
 * ========================================================= */
const isEmpty = computed(
  () =>
    props.modelValue === null ||
    props.modelValue === undefined ||
    props.modelValue === ("" as never),
);

const hasIcon = computed(() => !!props.icon || !!props.filledIcon);
const hasSuffix = computed(() => !!props.suffix);

const inputClasses = computed(() => [
  "appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] py-4 gap-2 font-medium transition-all duration-300",
  "[&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden [-moz-appearance:textfield]",
  hasIcon.value ? "pl-12" : "pl-4",
  hasSuffix.value ? "pr-[98px]" : "pr-4",
  props.disabled ? "bg-desa-background cursor-not-allowed opacity-60" : "",
  props.errorMessage
    ? "ring-red-500 focus:ring-red-500"
    : "ring-desa-background focus:ring-desa-black",
  isEmpty.value ? "placeholder:text-desa-secondary" : "",
]);

/* =========================================================
 * HANDLERS
 * ========================================================= */
function handleInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value;
  const parsed = raw === "" ? null : Number(raw);
  emit("update:modelValue", parsed);
  emit("input", parsed);
}

function handleChange(event: Event) {
  const raw = (event.target as HTMLInputElement).value;
  const parsed = raw === "" ? null : Number(raw);
  emit("change", parsed);
}
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <label class="relative group w-full">
      <!-- Input -->
      <input
        :name="name"
        type="number"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :disabled="disabled"
        :min="min"
        :max="max"
        :step="step"
        :class="inputClasses"
        @input="handleInput"
        @change="handleChange"
      />

      <!-- Icon kiri: secondary-green saat kosong, black saat terisi -->
      <div
        v-if="hasIcon"
        class="absolute transform -translate-y-1/2 top-1/2 left-4 flex size-6 shrink-0 pointer-events-none"
        aria-hidden="true"
      >
        <img
          v-if="icon"
          :src="icon"
          class="size-6"
          :class="isEmpty ? 'flex' : 'hidden'"
          alt=""
        />
        <img
          v-if="filledIcon"
          :src="filledIcon"
          class="size-6"
          :class="isEmpty ? 'hidden' : 'flex'"
          alt=""
        />
      </div>

      <!-- Suffix kanan (misal: "Hari", "m²", dll) -->
      <div
        v-if="hasSuffix"
        class="absolute transform -translate-y-1/2 top-1/2 right-4 flex shrink-0 items-center gap-4 pointer-events-none"
        aria-hidden="true"
      >
        <div class="w-px h-6 border border-desa-background"></div>
        <span
          class="font-medium leading-5 transition-setup"
          :class="isEmpty ? 'text-desa-secondary' : 'text-desa-dark-green'"
        >
          {{ suffix }}
        </span>
      </div>
    </label>

    <!-- Error message -->
    <span v-if="errorMessage" role="alert" class="text-desa-red text-sm block">
      {{ errorMessage }}
    </span>
  </div>
</template>
