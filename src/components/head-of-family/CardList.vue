<!-- src/components/head-of-family/CardList.vue -->
<script setup>
import { ROUTE_NAMES } from "@/config/routes.config";
import { ref, computed } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

// ✅ Default image jika profile picture tidak ada
const defaultImage = "/images/default-avatar.png"; // sesuaikan path

// ✅ Handle image error
const imageError = ref(false);
const imageUrl = computed(() => {
  if (imageError.value || !props.item.profile_picture) {
    return defaultImage;
  }
  return props.item.profile_picture;
});

const handleImageError = () => {
  imageError.value = true;
};
</script>

<template>
  <div
    class="card flex items-center justify-between rounded-3xl p-6 bg-white hover:shadow-md transition-shadow"
  >
    <div class="flex items-center gap-3 w-[260px]">
      <div
        class="flex size-16 shrink-0 rounded-full overflow-hidden bg-desa-foreshadow"
      >
        <img
          :src="imageUrl"
          class="w-full h-full object-cover"
          alt="photo"
          @error="handleImageError"
        />
      </div>
      <div class="flex flex-col gap-[6px]">
        <p
          class="font-semibold text-lg leading-[22.5px] w-[184px] truncate"
          :title="item.user?.name"
        >
          {{ item.user?.name || "Nama tidak tersedia" }}
        </p>
        <p class="flex items-center gap-1">
          <img
            src="@/assets/images/icons/briefcase-secondary-green.svg"
            class="flex size-[18px] shrink-0"
            alt="icon"
          />
          <span class="font-medium text-sm text-desa-secondary">
            {{ item.occupation || "Tidak ada pekerjaan" }}
          </span>
        </p>
      </div>
    </div>
    <div class="flex flex-col gap-1 w-[180px] shrink-0">
      <p class="flex items-center gap-1">
        <img
          src="@/assets/images/icons/keyboard-secondary-green.svg"
          class="flex size-[18px] shrink-0"
          alt="icon"
        />
        <span class="font-medium text-sm text-desa-secondary">NIK</span>
      </p>
      <p class="font-semibold leading-5">
        {{ item.identity_number || "-" }}
      </p>
    </div>
    <p
      class="flex items-center rounded-full w-[224px] shrink-0 py-[14px] px-4 gap-1 bg-desa-blue/10"
    >
      <img
        src="@/assets/images/icons/profile-2user-blue.svg"
        class="flex size-[18px] shrink-0"
        alt="icon"
      />
      <span class="font-medium text-desa-blue">
        {{ item.family_members?.length || 0 }} Anggota Keluarga
      </span>
    </p>
    <RouterLink
      :to="{ name: ROUTE_NAMES.MANAGE_HEAD_OF_FAMILY, params: { id: item.id } }"
      class="flex items-center shrink-0 gap-[10px] rounded-2xl py-4 px-6 bg-desa-black hover:bg-desa-black/90 transition-colors"
    >
      <span class="font-medium text-white">Manage</span>
    </RouterLink>
  </div>
</template>
