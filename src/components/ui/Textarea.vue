<!-- src/components/ui/Textarea.vue -->
<script setup lang="ts">
const model = defineModel<string>({ required: true });

defineProps<{
  name?: string;
  placeholder?: string;
  rows?: number;
  errorMessage?: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-2">
    <textarea
      v-model="model"
      :name="name"
      :placeholder="placeholder"
      :rows="rows ?? 6"
      :aria-invalid="!!errorMessage"
      class="appearance-none outline-none w-full rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 px-4 font-medium placeholder:text-desa-secondary transition-all duration-300 resize-none"
      :class="{ 'ring-red-500': errorMessage }"
    />

    <span
      v-if="errorMessage"
      role="alert"
      class="font-medium text-sm text-desa-red"
    >
      {{ errorMessage }}
    </span>
  </div>
</template>
