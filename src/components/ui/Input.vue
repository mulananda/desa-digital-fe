<!-- src/component/ui/input.vue -->
<script setup>
const model = defineModel({
  type: String,
  required: true,
});

defineProps({
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  errorMessage: {
    type: [String, Array],
    default: "",
  },
  icon: {
    type: String,
    required: true,
  },
  filledIcon: {
    type: String,
    required: true,
  },
  autocomplete: {
    type: String,
    default: "off",
  },
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="relative">
      <input
        v-model="model"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :type="type"
        class="peer w-full h-[56px] rounded-2xl pl-[48px] pr-4 border-[1.5px] border-desa-background font-medium leading-5 focus:ring-[1.5px] focus:ring-desa-dark-green focus:outline-none placeholder:leading-5 placeholder:text-desa-secondary placeholder:font-medium transition-all duration-300"
        :class="{ 'border-red-500': errorMessage }"
      />

      <img
        :src="icon"
        class="absolute size-6 top-1/2 left-4 -translate-y-1/2 opacity-0 peer-placeholder-shown:opacity-100 transition-all duration-300"
      />
      <img
        :src="filledIcon"
        class="absolute size-6 top-1/2 left-4 -translate-y-1/2 opacity-100 peer-placeholder-shown:opacity-0 transition-all duration-300"
      />
    </div>

    <span v-if="errorMessage" class="font-medium text-sm text-desa-red">
      {{ errorMessage[0] }}
    </span>
  </div>
</template>
