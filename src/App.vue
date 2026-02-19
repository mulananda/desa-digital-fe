<script setup>
import { RouterLink, RouterView } from "vue-router";
import {
  lightTheme,
  pastelTheme,
  Notification,
  NotificationProgress,
  Notivue,
} from "notivue";
import ErrorBoundary from "@/components/ui/state/ErrorBoundary.vue";
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
  <main>
    <ErrorBoundary>
      <RouterView />
    </ErrorBoundary>
  </main>
</template>
