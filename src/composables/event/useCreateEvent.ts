import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useRouter } from "vue-router";

import { CreateEventPayload } from "@/schemas/event/event.schema";
import { createEvent } from "@/services/event/events.service";
import { eventKeys } from "@/queryKeys/event.keys";
import { notificationService } from "@/services/notification.service";
import { errorHandlerService } from "@/services/errorHandler.service";
import { ROUTE_NAMES } from "@/config/routes.config";

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload: CreateEventPayload) => createEvent(payload),

    onSuccess: async () => {
      // Invalidate list agar data terbaru muncul
      await queryClient.invalidateQueries({
        queryKey: eventKeys.lists(),
      });

      notificationService.success("Event desa berhasil ditambahkan");
      await router.push({ name: ROUTE_NAMES.EVENT });
    },

    onError: (error: Error) => {
      const status = (error as any)?.response?.status;
      if (status !== 422) {
        // 422 dibiarkan bubble up ke catch di handleSubmit view
        errorHandlerService.handle(error, {
          context: "Event-create",
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
