// src/composables/development/useDevelopment.ts
import { ref } from "vue";
import { usePaginatedQuery } from "@/composables/usePaginatedQuery";
import type { Development } from "@/types/development.type";
import {
  DevelopmentSearch,
  fetchDevelopments,
} from "@/services/development/development.service";
import { developmentKeys } from "@/queryKeys/development.keys";

export function useDevelopments() {
  const search = ref<string>("");

  const pagination = usePaginatedQuery<
    // types
    Development,
    DevelopmentSearch | undefined
  >({
    queryKey: ({ page, perPage, search }) =>
      // keys
      developmentKeys.list({
        keyword: search?.keyword,
        page,
        perPage,
      }),

    // fetch
    fetcher: fetchDevelopments,

    search: () => (search.value ? { keyword: search.value } : undefined),

    perPage: 10,
  });

  return {
    search,
    ...pagination,
  };
}
