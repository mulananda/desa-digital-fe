import { useMutation, useQuery } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";

import { developmentKeys } from "@/queryKeys/development.keys";
import { getDevelopmentById } from "@/services/development/development.service";
import type { CreateDevelopmentPayload } from "@/types/development.type";

export const useDevelopment = (id: Ref<string | undefined>) => {
  const enabled = computed(() => !!id.value);

  const query = useQuery({
    enabled,
    staleTime: 1000 * 60 * 5,
    queryKey: computed(() => developmentKeys.details(id.value!)),

    queryFn: () => getDevelopmentById(id.value!),
  });

  return {
    development: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};
