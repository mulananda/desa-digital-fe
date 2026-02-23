// src/composables/social-assistances/useSocialAssistance.ts
import { useQuery } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRef } from "vue";

import { socialAssistanceKeys } from "@/queryKeys/socialAssistance.keys";
import { getSocialAssistanceById } from "@/services/social-assistance/socialAssistances.service";
import type { SocialAssistance } from "@/types/socialAssistance.type";
import type { SocialAssistanceCategory } from "@/schemas/social-assistance/socialAssistance.schema";

// ---------- Empty fallback ----------
const EMPTY_SOCIAL_ASSISTANCE: SocialAssistance = {
  id: "",
  name: "",
  category: "" as SocialAssistanceCategory, // cast agar type-safe
  amount: 0,
  provider: "",
  description: "",
  thumbnail: "",
  is_available: false,
  social_assistance_recipients: [],
  social_assistance_recipients_count: 0,
};

export const useSocialAssistance = (id: MaybeRef<string | undefined>) => {
  // MaybeRef: bisa terima ref<string> atau string biasa
  const resolvedId = computed(() => toValue(id));
  const enabled = computed(() => !!resolvedId.value);

  const query = useQuery({
    enabled,
    staleTime: 1000 * 60 * 5, // 5 menit

    queryKey: computed(() =>
      socialAssistanceKeys.detail(resolvedId.value as string),
    ),

    // Langsung pakai resolvedId — tidak perlu destructure dari queryKey
    queryFn: () => getSocialAssistanceById(resolvedId.value as string),

    select: (data): SocialAssistance => {
      if (!data) return EMPTY_SOCIAL_ASSISTANCE;

      return {
        ...EMPTY_SOCIAL_ASSISTANCE,
        ...data,
        social_assistance_recipients: data.social_assistance_recipients ?? [],
      };
    },
  });

  return {
    socialAssistance: query.data,
    isPending: query.isPending, // untuk loading state awal (belum ada data)
    isFetching: query.isFetching, // untuk background refetch indicator
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
