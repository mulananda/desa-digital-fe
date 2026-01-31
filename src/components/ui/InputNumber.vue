<!-- src/components/ui/InputNumber.vue -->
<script setup>
import { computed } from "vue";
import { formatRupiah, parseRupiah } from "@/helpers/format";

const model = defineModel({
  type: Number,
  default: null,
});

const props = defineProps({
  placeholder: String,
  errorMessage: [String, Array],
  icon: String,
  filledIcon: String,
  autocomplete: {
    type: String,
    default: "off",
  },
  min: Number,
  max: Number,

  /** 👇 optional */
  currency: {
    type: Boolean,
    default: true, // default Rupiah
  },
});

/**
 * STRING untuk UI
 * NUMBER untuk parent
 */
const inputValue = computed({
  get() {
    if (model.value === null || model.value === undefined) return "";

    return props.currency ? formatRupiah(model.value) : model.value;
  },
  set(value) {
    if (!value) {
      model.value = null;
      return;
    }

    let numeric = props.currency ? parseRupiah(value) : Number(value);

    if (props.min !== undefined && numeric < props.min) numeric = props.min;
    if (props.max !== undefined && numeric > props.max) numeric = props.max;

    model.value = isNaN(numeric) ? null : numeric;
  },
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="relative">
      <input
        v-model="inputValue"
        type="text"
        inputmode="decimal"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        class="peer w-full h-[56px] rounded-2xl pl-[48px] pr-4 border-[1.5px] border-desa-background font-medium leading-5 focus:ring-[1.5px] focus:ring-desa-dark-green focus:outline-none placeholder:text-desa-secondary transition-all duration-300"
        :class="{ 'border-red-500': errorMessage }"
      />

      <!-- icon kosong -->
      <img
        :src="icon"
        class="absolute size-6 top-1/2 left-4 -translate-y-1/2 opacity-0 peer-placeholder-shown:opacity-100 transition-all"
      />

      <!-- icon terisi -->
      <img
        :src="filledIcon"
        class="absolute size-6 top-1/2 left-4 -translate-y-1/2 opacity-100 peer-placeholder-shown:opacity-0 transition-all"
      />
    </div>

    <span v-if="errorMessage" class="font-medium text-sm text-desa-red">
      {{ Array.isArray(errorMessage) ? errorMessage[0] : errorMessage }}
    </span>
  </div>
</template>
