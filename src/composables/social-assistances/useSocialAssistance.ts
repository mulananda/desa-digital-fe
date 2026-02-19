import { useQuery } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";
import { socialAssistanceKeys } from "@/queryKeys/socialAssistance.keys";
import { getSocialAssistanceById } from "@/services/social-assistance/socialAssistances.service";
import type { SocialAssistance } from "@/types/socialAssistance.type";

/**
 * Default model untuk mencegah undefined saat render pertama.
 * Ini jadi fallback sebelum data API datang.
 */
const EMPTY_SOCIAL_ASSISTANCE: SocialAssistance = {
  id: "",
  name: "",
  category: "",
  amount: 0,
  provider: "",
  description: "",
  thumbnail: "",
  is_available: false,
  social_assistance_recipients: [],
  social_assistance_recipients_count: 0,
};

export const useSocialAssistance = (id: Ref<string | undefined>) => {
  const enabled = computed(() => !!id.value);

  const query = useQuery({
    enabled,
    staleTime: 1000 * 60 * 5,

    queryKey: computed(() => socialAssistanceKeys.detail(id.value as string)),

    queryFn: ({ queryKey }) => {
      const [, , socialAssistanceId] = queryKey as ReturnType<
        typeof socialAssistanceKeys.detail
      >;

      return getSocialAssistanceById(socialAssistanceId);
    },
    /**
     * 🔥 Normalisasi data di sini
     * Component akan SELALU menerima object valid
     */
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
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};
