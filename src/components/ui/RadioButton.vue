<script setup>
const model = defineModel({ type: String });

defineProps({
  value: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  id: String,
  disabled: Boolean,
  required: Boolean,
});
</script>

<template>
  <input type="radio" :name="name" :value="value" v-model="model" />
</template>
