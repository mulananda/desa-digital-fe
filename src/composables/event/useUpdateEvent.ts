// src/composables/event/useUpdateEvent.ts
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useRouter } from "vue-router";
import { ROUTE_NAMES } from "@/config/routes.config";
import { notificationService } from "@/services/notification.service";
import { errorHandlerService } from "@/services/errorHandler.service";
import { EventUpdatePayload } from "@/schemas/event/event.schema";
import { updateEvent } from "@/services/event/events.service";
import { eventKeys } from "@/queryKeys/event.keys";

export const useUpdateEvent = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload: EventUpdatePayload) => updateEvent(id, payload),

    onSuccess: async () => {
      // Invalidate list dan detail sekaligus
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: eventKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: eventKeys.detail(id),
        }),
      ]);

      notificationService.success("Event desa berhasil diperbarui");
      await router.push({
        name: ROUTE_NAMES.MANAGE_EVENT,
        params: { id: id },
      });
    },

    onError: (error: Error) => {
      const status = (error as any)?.response?.status;
      if (status !== 422) {
        errorHandlerService.handle(error, {
          context: "event-update",
          showNotification: true,
        });
      }
    },
  });

  return {
    mutate: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
