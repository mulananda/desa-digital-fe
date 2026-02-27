<!-- src/components/ui/InputNumber.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { formatRupiah } from "@/utils/currency";

const model = defineModel<string | number>({ required: true });

const props = defineProps<{
  placeholder?: string;
  errorMessage?: string;
  icon: string;
  filledIcon: string;
  min?: number;
  max?: number;
  step?: number;
  rupiah?: boolean; // ← tambah prop mode rupiah
}>();

// Display value: jika rupiah mode dan ada value, format ke Rupiah
const displayValue = computed(() => {
  if (!props.rupiah || model.value === "" || model.value === null) {
    return model.value;
  }
  return formatRupiah(model.value);
});

function handleInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value;

  if (props.rupiah) {
    // Strip semua non-digit sebelum simpan ke model
    const numeric = raw.replace(/\D/g, "");
    model.value = numeric === "" ? "" : Number(numeric);
  } else {
    model.value = raw;
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="relative">
      <input
        :value="displayValue"
        :type="rupiah ? 'text' : 'number'"
        :placeholder="placeholder"
        :min="rupiah ? undefined : min"
        :max="rupiah ? undefined : max"
        :step="rupiah ? undefined : (step ?? 1)"
        inputmode="numeric"
        class="peer w-full h-[56px] rounded-2xl pl-[48px] pr-4 border-[1.5px] border-desa-background font-medium leading-5 focus:ring-[1.5px] focus:ring-desa-dark-green focus:outline-none placeholder:leading-5 placeholder:text-desa-secondary placeholder:font-medium transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        :class="{ 'border-red-500': errorMessage }"
        @input="handleInput"
      />
      <img
        :src="icon"
        aria-hidden="true"
        class="absolute size-6 top-1/2 left-4 -translate-y-1/2 opacity-0 peer-placeholder-shown:opacity-100 transition-all duration-300"
      />
      <img
        :src="filledIcon"
        aria-hidden="true"
        class="absolute size-6 top-1/2 left-4 -translate-y-1/2 opacity-100 peer-placeholder-shown:opacity-0 transition-all duration-300"
      />
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
