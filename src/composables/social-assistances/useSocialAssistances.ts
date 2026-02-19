// src/composables/social-assistances/useSocialAssistances.ts
import { ref, computed } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import { useAuthStore } from "@/stores/auth";
import { usePaginatedQuery } from "@/composables/usePaginatedQuery";
import type { SocialAssistance } from "@/types/socialAssistance.type";
import {
  fetchSocialAssistances,
  SocialAssistanceSearch,
} from "@/services/social-assistance/socialAssistances.service";
import { sanitizeSearchParam } from "@/utils/sanitization";
import { socialAssistanceKeys } from "@/queryKeys/socialAssistance.keys";

export function useSocialAssistances() {
  const search = ref<string>("");
  const authStore = useAuthStore();
  const queryClient = useQueryClient();

  // ✅ NEW: Check permission
  const hasPermission = computed(() =>
    authStore.hasPermission("social-assistance-list"),
  );

  // ✅ NEW: Error message jika no permission
  const permissionError = computed(() =>
    hasPermission.value
      ? null
      : "Anda tidak memiliki akses untuk melihat data ini",
  );

  const pagination = usePaginatedQuery<
    // types
    SocialAssistance,
    SocialAssistanceSearch | undefined
  >({
    queryKey: ({ page, perPage, search }) =>
      // keys
      socialAssistanceKeys.list({
        keyword: sanitizeSearchParam(search?.keyword), // ✅ NEW: Sanitize
        page,
        perPage,
      }),

    // fetch
    fetcher: fetchSocialAssistances,

    search: () => (search.value ? { keyword: search.value } : undefined),

    perPage: 10,

    // ✅ NEW: Disable query jika no permission
    enabled: () => hasPermission.value,
  });

  // ✅ NEW: Helper untuk invalidate cache after mutations
  const invalidateCache = () => {
    queryClient.invalidateQueries({
      queryKey: socialAssistanceKeys.lists(),
    });
  };

  return {
    search,
    permissionError, // ✅ NEW: Expose untuk show di UI
    invalidateCache, // ✅ NEW: Use di create/update/delete
    ...pagination,
  };
}
