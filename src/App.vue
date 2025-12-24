<script setup>
import { RouterLink, RouterView } from "vue-router";
import {
  lightTheme,
  pastelTheme,
  Notification,
  NotificationProgress,
  Notivue,
} from "notivue";
</script>

<template>
  <Notivue v-slot="item">
    <Notification
      :item="item"
      :theme="pastelTheme"
      v-bind="item"
      class="w-[420px] h-[72px] flex items-center gap-3 px-4 rounded-2xl"
    />
    <NotificationProgress :item="item" />
  </Notivue>

  <RouterView />
</template>
