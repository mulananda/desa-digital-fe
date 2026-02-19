// src/composables/development/useDevelopments.ts
import { ref, computed } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import { useAuthStore } from "@/stores/auth";
import { usePaginatedQuery } from "@/composables/usePaginatedQuery";
import type { Development } from "@/types/development.type";
import {
  DevelopmentSearch,
  fetchDevelopments,
} from "@/services/development/developments.service";
import { developmentKeys } from "@/queryKeys/development.keys";
import { sanitizeSearchParam } from "@/utils/sanitization";

export function useDevelopments() {
  const search = ref<string>("");
  const authStore = useAuthStore();
  const queryClient = useQueryClient();

  // ✅ NEW: Check permission
  const hasPermission = computed(() =>
    authStore.hasPermission("development-list"),
  );

  // ✅ NEW: Error message jika no permission
  const permissionError = computed(() =>
    hasPermission.value
      ? null
      : "Anda tidak memiliki akses untuk melihat data ini",
  );

  const pagination = usePaginatedQuery<
    // types
    Development,
    DevelopmentSearch | undefined
  >({
    queryKey: ({ page, perPage, search }) =>
      // keys
      developmentKeys.list({
        keyword: sanitizeSearchParam(search?.keyword),
        page,
        perPage,
      }),

    // fetch
    fetcher: fetchDevelopments,

    search: () => (search.value ? { keyword: search.value } : undefined),

    perPage: 10,

    // ✅ NEW: Disable query jika no permission
    enabled: () => hasPermission.value,
  });

  // ✅ NEW: Helper untuk invalidate cache
  const invalidateCache = () => {
    queryClient.invalidateQueries({
      queryKey: developmentKeys.lists(),
    });
  };

  return {
    search,
    permissionError,
    invalidateCache,
    ...pagination,
  };
}
