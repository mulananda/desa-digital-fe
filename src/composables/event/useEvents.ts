// src/composables/event/useEvents.ts
import { ref, computed } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import { useAuthStore } from "@/stores/auth";
import { usePaginatedQuery } from "@/composables/usePaginatedQuery";
import { sanitizeSearchParam } from "@/utils/sanitization";
import { Event } from "@/types/event.type";
import { EventSearch, fetchEvents } from "@/services/event/events.service";
import { eventKeys } from "@/queryKeys/event.keys";

export function useEvents() {
  const search = ref<string>("");
  const authStore = useAuthStore();
  const queryClient = useQueryClient();

  // ✅ NEW: Check permission
  const hasPermission = computed(() => authStore.hasPermission("event-list"));

  // ✅ NEW: Error message jika no permission
  const permissionError = computed(() =>
    hasPermission.value
      ? null
      : "Anda tidak memiliki akses untuk melihat data ini",
  );

  const pagination = usePaginatedQuery<
    // types
    Event,
    EventSearch | undefined
  >({
    queryKey: ({ page, perPage, search }) =>
      // keys
      eventKeys.list({
        keyword: sanitizeSearchParam(search?.keyword),
        page,
        perPage,
      }),

    // fetch
    fetcher: fetchEvents,

    search: () => (search.value ? { keyword: search.value } : undefined),

    perPage: 10,

    // ✅ NEW: Disable query jika no permission
    enabled: () => hasPermission.value,
  });

  // ✅ NEW: Helper untuk invalidate cache
  const invalidateCache = () => {
    queryClient.invalidateQueries({
      queryKey: eventKeys.lists(),
    });
  };

  return {
    search,
    permissionError,
    invalidateCache,
    ...pagination,
  };
}
