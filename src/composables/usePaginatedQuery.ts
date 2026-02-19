import { ref, computed, watch, onBeforeUnmount } from "vue";
import { useQuery, keepPreviousData, type QueryKey } from "@tanstack/vue-query";
import type { PaginatedResponse, PaginationMeta } from "@/types/api";

/* ================= TYPES ================= */
export interface PaginatedFetcher<T, TSearch = unknown> {
  (
    params: {
      page: number;
      perPage: number;
      search?: TSearch;
    },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<T>>;
}

export interface UsePaginatedQueryOptions<T, TSearch = unknown> {
  queryKey: (params: {
    page: number;
    perPage: number;
    search?: TSearch;
  }) => QueryKey;

  fetcher: PaginatedFetcher<T, TSearch>;
  perPage?: number;
  search?: () => TSearch;
  enabled?: () => boolean;
  staleTime?: number;
  debounceMs?: number;
}

/* ================= COMPOSABLE ================= */
export function usePaginatedQuery<T, TSearch = unknown>(
  options: UsePaginatedQueryOptions<T, TSearch>,
) {
  const {
    queryKey,
    fetcher,
    perPage: initialPerPage = 10,
    search,
    enabled = () => true,
    staleTime = 30_000,
    debounceMs = 400,
  } = options;

  /* ================= STATE ================= */
  const page = ref(1);
  const perPage = ref(initialPerPage);

  /* ================= ABORT CONTROLLER ================= */
  // ✅ NEW: Handle request cancellation for race conditions
  const abortController = ref<AbortController>(new AbortController());

  /* ================= SEARCH (DEBOUNCED) ================= */
  const rawSearch = computed(() => search?.());
  const debouncedSearch = ref<TSearch | undefined>(rawSearch.value);

  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  watch(rawSearch, (value) => {
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      debouncedSearch.value = value;
      page.value = 1; // 🔥 reset page on search
    }, debounceMs);
  });

  onBeforeUnmount(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
  });

  /* ================= QUERY KEY ================= */
  const queryKeyComputed = computed(() =>
    queryKey({
      page: page.value,
      perPage: perPage.value,
      search: debouncedSearch.value,
    }),
  );

  /* ================= ABORT ON QUERY KEY CHANGE ================= */
  // ✅ NEW: Cancel previous request when query key changes
  watch(
    queryKeyComputed,
    () => {
      // Cancel any in-flight request
      abortController.value.abort();
      // Create new controller for next request
      abortController.value = new AbortController();
    },
    { immediate: false },
  );

  /* ================= QUERY ================= */
  const query = useQuery({
    queryKey: queryKeyComputed,
    queryFn: () =>
      fetcher(
        {
          page: page.value,
          perPage: perPage.value,
          search: debouncedSearch.value,
        },
        {
          signal: abortController.value.signal, // ✅ NEW: Pass abort signal
        },
      ),
    enabled: computed(() => enabled()),
    staleTime,

    // ✅ v5 replacement for keepPreviousData
    placeholderData: keepPreviousData,
  });

  /* ================= DERIVED ================= */
  const data = computed<T[]>(() => query.data.value?.data ?? []);
  const meta = computed<PaginationMeta | null>(
    () => query.data.value?.meta ?? null,
  );

  const isEmpty = computed(
    () =>
      !query.isLoading.value &&
      !query.isFetching.value &&
      data.value.length === 0,
  );

  /* ================= SAFETY GUARD ================= */
  watch(
    () => meta.value?.last_page,
    (lastPage) => {
      if (lastPage && page.value > lastPage) {
        page.value = lastPage;
      }
    },
  );

  /* ================= ACTIONS ================= */
  function setPage(value: number) {
    if (value !== page.value) {
      page.value = value;
    }
  }

  function setPerPage(value: number) {
    if (value !== perPage.value) {
      page.value = 1; // 🔥 RESET FIRST
      perPage.value = value;
    }
  }

  function reset() {
    page.value = 1;
  }

  /* ================= CLEANUP ================= */
  // ✅ NEW: Cleanup on unmount
  onBeforeUnmount(() => {
    abortController.value.abort();
  });

  /* ================= EXPOSE ================= */
  return {
    page,
    perPage,
    setPage,
    setPerPage,
    reset,

    data,
    meta,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    isEmpty,

    refetch: query.refetch,
  };
}
