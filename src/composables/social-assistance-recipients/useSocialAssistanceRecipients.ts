// src/composables/social-assistance-recipients/useSocialAssistanceRecipients.ts
import { ref, computed } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import { useAuthStore } from "@/stores/auth";
import { usePaginatedQuery } from "@/composables/usePaginatedQuery";
import {
  fetchSocialAssistanceRecipients,
  type RecipientSearch,
} from "@/services/social-assistance-recipient/socialAssistanceRecipients.service";
import { socialAssistanceRecipientKeys } from "@/queryKeys/socialAssistanceRecipient.keys";
import type { SocialAssistanceRecipient } from "@/types/socialAssistanceRecipient.type";
import { sanitizeSearchParam } from "@/utils/sanitization";

export function useSocialAssistanceRecipients() {
  const search = ref<string>("");
  const authStore = useAuthStore();
  const queryClient = useQueryClient();

  // ✅ NEW: Check permission
  const hasPermission = computed(() =>
    authStore.hasPermission("social-assistance-recipient-list"),
  );

  // ✅ NEW: Error message jika no permission
  const permissionError = computed(() =>
    hasPermission.value
      ? null
      : "Anda tidak memiliki akses untuk melihat data ini",
  );

  const pagination = usePaginatedQuery<
    SocialAssistanceRecipient,
    RecipientSearch | undefined
  >({
    queryKey: ({ page, perPage, search }) =>
      socialAssistanceRecipientKeys.list({
        keyword: sanitizeSearchParam(search?.keyword), // ✅ NEW: Sanitize
        page,
        perPage,
      }),

    fetcher: fetchSocialAssistanceRecipients,

    search: () => (search.value ? { keyword: search.value } : undefined),

    perPage: 10,

    // ✅ NEW: Disable query jika no permission
    enabled: () => hasPermission.value,
  });

  // ✅ NEW: Helper untuk invalidate cache after mutations
  const invalidateCache = () => {
    queryClient.invalidateQueries({
      queryKey: socialAssistanceRecipientKeys.lists(),
    });
  };

  return {
    search,
    permissionError, // ✅ NEW: Expose untuk show di UI
    invalidateCache, // ✅ NEW: Use di create/update/delete
    ...pagination,
  };
}
