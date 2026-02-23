// src/composables/development/useDevelopment.ts
import { useQuery } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRef } from "vue";

import { developmentKeys } from "@/queryKeys/development.keys";
import { getDevelopmentById } from "@/services/development/developments.service";
import type { Development } from "@/types/development.type";

const EMPTY_DEVELOPMENT: Development = {
  id: "",
  thumbnail: "",
  name: "",
  description: "",
  person_in_charge: "",
  start_date: "",
  end_date: "",
  amount: 0,
  status: "ongoing",
  development_applicants: [],
  development_applicants_count: 0,
};

export const useDevelopment = (id: MaybeRef<string | undefined>) => {
  const resolvedId = computed(() => toValue(id));
  const enabled = computed(() => !!resolvedId.value);

  const query = useQuery({
    enabled,
    staleTime: 1000 * 60 * 5,

    queryKey: computed(() =>
      developmentKeys.detail(resolvedId.value as string),
    ),

    queryFn: () => getDevelopmentById(resolvedId.value as string),

    select: (data): Development => ({
      ...EMPTY_DEVELOPMENT,
      ...data,
      development_applicants: data.development_applicants ?? [],
    }),
  });

  return {
    development: query.data,
    isPending: query.isPending,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
