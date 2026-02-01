<script setup>
import { ref, computed, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const route = useRoute();

/**
 * STATE ACCORDION
 * - auto open jika child aktif
 * - sinkron dengan route change
 */
const isOpen = ref(false);

/**
 * ACTIVE STATE (via meta.sidebarKey)
 * untuk item tanpa children
 */
const isActive = computed(() => {
  return route.meta?.sidebarKey === props.item.sidebarKey;
});

/**
 * 🆕 CEK APAKAH ADA CHILD YANG AKTIF
 */
const isChildActive = () => {
  if (!props.item.children) return false;

  return props.item.children.some(
    (child) => child.sidebarKey === route.meta?.sidebarKey,
  );
};

/**
 * 🔧 ACTIVE STATE UNTUK PARENT
 * aktif jika:
 * - salah satu child aktif
 */
const isParentActive = computed(() => {
  if (!props.item.children) return isActive.value;

  return isChildActive();
});

/**
 * 🔧 WATCH ROUTE
 * auto buka accordion jika salah satu child aktif
 */
watch(
  () => route.meta?.sidebarKey,
  () => {
    if (!props.item.children) return;

    isOpen.value = isChildActive();
  },
  { immediate: true },
);
</script>

<template>
  <!-- ===================== -->
  <!-- SINGLE MENU (NO CHILD) -->
  <!-- ===================== -->
  <li v-if="!item.children" class="group" :class="{ active: isActive }">
    <RouterLink
      :to="item.path"
      class="flex items-center h-14 gap-2 rounded-2xl p-4 group-hover:bg-desa-foreshadow group-[.active]:bg-desa-foreshadow transition-setup"
    >
      <div
        v-if="item.iconActive && item.iconInActive"
        class="relative flex size-6 shrink-0"
      >
        <img
          :src="item.iconActive"
          class="absolute size-6 opacity-0 group-hover:opacity-100 group-[.active]:opacity-100 transition-setup"
          alt="icon"
        />
        <img
          :src="item.iconInActive"
          class="absolute size-6 opacity-100 group-hover:opacity-0 group-[.active]:opacity-0 transition-setup"
          alt="icon"
        />
      </div>

      <span
        class="flex-1 text-desa-secondary leading-5 group-hover:text-desa-dark-green group-[.active]:text-desa-dark-green group-[.active]:font-medium transition-setup"
      >
        {{ item.label }}
      </span>
    </RouterLink>
  </li>

  <!-- ================= -->
  <!-- ACCORDION / CHILD -->
  <!-- ================= -->
  <li v-else class="flex flex-col gap-1 w-full">
    <!-- HEADER -->
    <button
      class="group flex w-full items-center h-14 gap-2 rounded-2xl p-4 transition-setup"
      :class="{
        'bg-desa-foreshadow': isParentActive,
      }"
      @click="isOpen = !isOpen"
    >
      <!-- ICON -->
      <div class="relative flex size-6 shrink-0">
        <img
          :src="item.iconActive"
          class="absolute size-6 transition-setup"
          :class="{
            'opacity-100': isParentActive,
            'opacity-0': !isParentActive,
          }"
          alt="icon"
        />
        <img
          :src="item.iconInActive"
          class="absolute size-6 transition-setup"
          :class="{
            'opacity-0': isParentActive,
            'opacity-100': !isParentActive,
          }"
          alt="icon"
        />
      </div>

      <!-- LABEL -->
      <span
        class="flex-1 text-left leading-5 text-desa-secondary transition-setup"
        :class="{ 'text-desa-dark-green font-medium': isParentActive }"
      >
        {{ item.label }}
      </span>

      <!-- ARROW -->
      <div class="relative flex size-6 shrink-0">
        <img
          src="@/assets/images/icons/arrow-circle-dark-green-up.svg"
          class="absolute size-6 transition-setup"
          :class="{ 'opacity-100': isOpen, 'opacity-0': !isOpen }"
          alt="arrow up"
        />
        <img
          src="@/assets/images/icons/arrow-circle-secondary-green-down.svg"
          class="absolute size-6 transition-setup"
          :class="{ 'opacity-0': isOpen, 'opacity-100': !isOpen }"
          alt="arrow down"
        />
      </div>
    </button>

    <!-- CHILD LIST -->
    <ul
      :id="`accordion-${item.sidebarKey}`"
      class="flex flex-col pl-[28px]"
      :class="{ hidden: !isOpen }"
    >
      <SidebarItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
      />
    </ul>
  </li>
</template>
