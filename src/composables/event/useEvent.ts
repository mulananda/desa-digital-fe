// src/composables/event/useEvent.ts
import { computed, toValue, type MaybeRef } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { eventKeys } from "@/queryKeys/event.keys";
import { getEventById } from "@/services/event/events.service";
import type { Event } from "@/types/event.type";

const EMPTY_EVENT: Event = {
  id: "",
  thumbnail: "",
  name: "",
  description: "",
  price: 0,
  date: "",
  time: "",
  is_active: false,
  event_participants_count: 0,
};

export const useEvent = (id: MaybeRef<string | undefined>) => {
  const resolvedId = computed(() => toValue(id));
  const enabled = computed(() => !!resolvedId.value);

  const query = useQuery({
    enabled,
    staleTime: 1000 * 60 * 5,

    queryKey: computed(() => eventKeys.detail(resolvedId.value as string)),

    queryFn: () => getEventById(resolvedId.value as string),

    select: (data): Event => ({
      ...EMPTY_EVENT,
      ...data,
      // development_applicants: data.development_applicants ?? [],
    }),
  });

  return {
    event: query.data,
    isPending: query.isPending,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
