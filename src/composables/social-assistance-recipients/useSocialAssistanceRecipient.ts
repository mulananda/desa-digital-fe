// src/composables/social-assistance-recipients/useSocialAssistanceRecipient.ts
import { useQuery } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRef } from "vue";

import { socialAssistanceRecipientKeys } from "@/queryKeys/socialAssistanceRecipient.keys";
import { getSocialAssistanceRecipientById } from "@/services/social-assistance-recipient/socialAssistanceRecipients.service";
import type { SocialAssistanceRecipient } from "@/types/socialAssistanceRecipient.type";

export const useSocialAssistanceRecipient = (
  id: MaybeRef<string | null | undefined>,
) => {
  const resolvedId = computed(() => toValue(id));
  const enabled = computed(() => !!resolvedId.value);

  const query = useQuery({
    enabled,
    staleTime: 1000 * 60 * 5,

    queryKey: computed(() =>
      socialAssistanceRecipientKeys.detail(resolvedId.value as string),
    ),

    // Langsung pakai resolvedId — tidak perlu destructure dari queryKey
    queryFn: () => getSocialAssistanceRecipientById(resolvedId.value as string),

    // Normalisasi data agar komponen selalu terima object valid
    select: (data): SocialAssistanceRecipient => data,
  });

  return {
    recipient: query.data,
    isPending: query.isPending,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
