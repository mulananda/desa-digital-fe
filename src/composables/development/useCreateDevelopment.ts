// src/composables/development/useCreateDevelopment.ts
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useRouter } from "vue-router";

import { createDevelopment } from "@/services/development/developments.service";
import { developmentKeys } from "@/queryKeys/development.keys";
import { notificationService } from "@/services/notification.service";
import { errorHandlerService } from "@/services/errorHandler.service";
import { ROUTE_NAMES } from "@/config/routes.config";

import type { CreateDevelopmentPayload } from "@/schemas/development/development.schema";

export const useCreateDevelopment = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload: CreateDevelopmentPayload) =>
      createDevelopment(payload),

    onSuccess: async () => {
      // Invalidate list agar data terbaru muncul
      await queryClient.invalidateQueries({
        queryKey: developmentKeys.lists(),
      });

      notificationService.success("Pembangunan desa berhasil ditambahkan");
      await router.push({ name: ROUTE_NAMES.DEVELOPMENT });
    },

    onError: (error: Error) => {
      const status = (error as any)?.response?.status;
      if (status !== 422) {
        // 422 dibiarkan bubble up ke catch di handleSubmit view
        errorHandlerService.handle(error, {
          context: "Development-create",
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
