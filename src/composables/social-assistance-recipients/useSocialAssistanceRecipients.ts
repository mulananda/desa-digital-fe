// src/composables/social-assistance-recipients/useSocialAssistanceRecipients.ts
import { ref } from "vue";
import { usePaginatedQuery } from "@/composables/usePaginatedQuery";
import {
  fetchSocialAssistanceRecipients,
  type RecipientSearch,
} from "@/services/social-assistance-recipient/socialAssistanceRecipients.service";
import { socialAssistanceRecipientKeys } from "@/queryKeys/socialAssistanceRecipient.keys";
import type { SocialAssistanceRecipient } from "@/types/socialAssistanceRecipient.type";

export function useSocialAssistanceRecipients() {
  const search = ref<string>("");

  const pagination = usePaginatedQuery<
    // types
    SocialAssistanceRecipient,
    RecipientSearch | undefined
  >({
    queryKey: ({ page, perPage, search }) =>
      // keys
      socialAssistanceRecipientKeys.list({
        keyword: search?.keyword,
        page,
        perPage,
      }),

    // fetch
    fetcher: fetchSocialAssistanceRecipients,

    search: () => (search.value ? { keyword: search.value } : undefined),

    perPage: 10,
  });

  return {
    search,
    ...pagination,
  };
}
