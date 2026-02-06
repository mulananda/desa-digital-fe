import { useQuery } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";

import { socialAssistanceRecipientKeys } from "@/queryKeys/socialAssistanceRecipient.keys";
import { getSocialAssistanceRecipientById } from "@/services/social-assistance-recipient/socialAssistanceRecipient.service";

export const useSocialAssistanceRecipient = (id: Ref<string | undefined>) => {
  const enabled = computed(() => !!id.value);

  const query = useQuery({
    enabled,
    staleTime: 1000 * 60 * 5,

    queryKey: computed(() =>
      socialAssistanceRecipientKeys.detail(id.value as string),
    ),

    queryFn: ({ queryKey }) => {
      const [, , recipientId] = queryKey as ReturnType<
        typeof socialAssistanceRecipientKeys.detail
      >;

      return getSocialAssistanceRecipientById(recipientId);
    },
  });

  return {
    recipient: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};
