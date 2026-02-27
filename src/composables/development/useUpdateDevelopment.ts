// src/composables/development/useUpdateDevelopment.ts
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useRouter } from "vue-router";

import { updateDevelopment } from "@/services/development/developments.service";
import { developmentKeys } from "@/queryKeys/development.keys";
import { notificationService } from "@/services/notification.service";
import { errorHandlerService } from "@/services/errorHandler.service";
import { ROUTE_NAMES } from "@/config/routes.config";

import type { DevelopmentUpdatePayload } from "@/schemas/development/development.schema";

/*
 * Payload mutation dibungkus bersama originalAmount
 * karena amount di-omit dari schema tapi tetap perlu dikirim ke backend
 */
interface UpdateMutationVariables {
  payload: DevelopmentUpdatePayload;
  originalAmount: string | number;
}

export const useUpdateDevelopment = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: ({ payload, originalAmount }: UpdateMutationVariables) =>
      updateDevelopment(id, payload, originalAmount),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: developmentKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: developmentKeys.detail(id) }),
      ]);

      notificationService.success("Pembangunan desa berhasil diperbarui");
      await router.push({ name: ROUTE_NAMES.DEVELOPMENT_INDEX });
    },

    onError: (error: Error) => {
      const status = (error as any)?.response?.status;
      if (status !== 422) {
        // 422 dibiarkan bubble up ke catch di handleSubmit
        errorHandlerService.handle(error, {
          context: "Development-update",
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
