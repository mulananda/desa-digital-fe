<script setup>
import SidebarItem from "./SidebarItem.vue";
import { ROUTE_PATHS, SIDEBAR_KEYS } from "@/config/routes.config";

import iconChartActive from "@/assets/images/icons/chart-square-dark-green.svg";
import iconChartInactive from "@/assets/images/icons/chart-square-secondary-green.svg";
import iconCrownActive from "@/assets/images/icons/crown-dark-green.svg";
import iconCrownInactive from "@/assets/images/icons/crown-secondary-green.svg";
import iconBagActive from "@/assets/images/icons/bag-2-dark-green.svg";
import iconBagInactive from "@/assets/images/icons/bag-2-secondary-green.svg";

const sidebarItems = [
  {
    label: "Dashboard",
    path: "/",
    sidebarKey: SIDEBAR_KEYS.DASHBOARD,
    iconActive: iconChartActive,
    iconInActive: iconChartInactive,
  },
  {
    label: "Kepala Rumah",
    path: ROUTE_PATHS.HEAD_OF_FAMILY,
    sidebarKey: SIDEBAR_KEYS.HEAD_OF_FAMILY,
    iconActive: iconCrownActive,
    iconInActive: iconCrownInactive,
  },
  {
    label: "Bantuan Sosial",
    path: "",
    sidebarKey: SIDEBAR_KEYS.SOCIAL_ASSISTANCE,
    iconActive: iconBagActive,
    iconInActive: iconBagInactive,
    children: [
      {
        label: "List Bansos",
        path: ROUTE_PATHS.SOCIAL_ASSISTANCE,
        sidebarKey: SIDEBAR_KEYS.SOCIAL_ASSISTANCE,
      },
    ],
  },
];
</script>

<template>
  <aside
    id="Sidebar"
    class="relative flex w-[280px] shrink-0 min-h-screen bg-white border-r border-desa-foreshadow overflow-hidden"
  >
    <div
      class="fixed top-0 h-full w-[280px] flex shrink-0 flex-1 z-20 bg-white"
    >
      <div class="flex flex-col h-full w-full gap-6 pt-[30px] px-6">
        <div class="flex items-center justify-between">
          <img
            src="@/assets/images/logos/logo-text.svg"
            class="flex h-[30px] shrink-0"
            alt="logo"
          />
          <button
            class="flex size-11 items-center justify-center rounded-2xl border border-desa-background hover:border-desa-secondary transition-setup"
          >
            <img
              src="@/assets/images/icons/menu-secondary-green.svg"
              class="size-6"
              alt="icon"
            />
          </button>
        </div>
        <div
          class="flex flex-col flex-1 gap-6 overflow-y-scroll hide-scrollbar"
        >
          <nav class="flex flex-col gap-2 pb-12">
            <p class="font-medium text-sm text-desa-secondary">Main Menu</p>
            <ul class="flex flex-col gap-2">
              <SidebarItem
                v-for="item in sidebarItems"
                :key="item.sidebarKey || item.label"
                :item="item"
              />
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </aside>
</template>
