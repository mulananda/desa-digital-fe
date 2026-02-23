// src/composables/social-assistances/useCreateSocialAssistance.ts
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useRouter } from "vue-router";

import { socialAssistanceKeys } from "@/queryKeys/socialAssistance.keys";
import { notificationService } from "@/services/notification.service";
import { errorHandlerService } from "@/services/errorHandler.service";
import { ROUTE_NAMES } from "@/config/routes.config";

import type { CreateSocialAssistancePayload } from "@/schemas/social-assistance/socialAssistance.schema";
import { createSocialAssistance } from "@/services/social-assistance/socialAssistances.service";

export const useCreateSocialAssistance = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload: CreateSocialAssistancePayload) =>
      createSocialAssistance(payload),

    onSuccess: async () => {
      // Invalidate dulu, baru navigate — hindari race condition
      await queryClient.invalidateQueries({
        queryKey: socialAssistanceKeys.lists(),
      });

      notificationService.success("Bantuan sosial berhasil dibuat");
      await router.push({ name: ROUTE_NAMES.SOCIAL_ASSISTANCE });
    },

    onError: (error: Error) => {
      // Untuk 422 — field errors dihandle di view via extractBackendErrors
      // errorHandlerService hanya dipanggil untuk error selain 422
      const status = (error as any)?.response?.status;

      if (status !== 422) {
        errorHandlerService.handle(error, {
          context: "SocialAssistance-create",
          showNotification: true, // tampilkan notif untuk 500, 403, dst
        });
      }
    },
  });

  return {
    mutate: mutation.mutateAsync, // tetap expose mutateAsync untuk async/await di komponen
    isPending: mutation.isPending,
    isError: mutation.isError, // tambah isError untuk UI state, boolean
    error: mutation.error,
  };
};
