// src/composables/social-assistances/useUpdateSocialAssistance.ts
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useRouter } from "vue-router";

import { updateSocialAssistance } from "@/services/social-assistance/socialAssistances.service";
import { socialAssistanceKeys } from "@/queryKeys/socialAssistance.keys";
import { notificationService } from "@/services/notification.service";
import { errorHandlerService } from "@/services/errorHandler.service";
import { ROUTE_NAMES } from "@/config/routes.config";

import type { SocialAssistanceUpdatePayload } from "@/schemas/social-assistance/socialAssistance.schema";

export const useUpdateSocialAssistance = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload: SocialAssistanceUpdatePayload) =>
      updateSocialAssistance(id, payload),

    onSuccess: async () => {
      // Invalidate list dan detail sekaligus
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: socialAssistanceKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: socialAssistanceKeys.detail(id),
        }),
      ]);

      notificationService.success("Bantuan sosial berhasil diperbarui");
      await router.push({ name: ROUTE_NAMES.SOCIAL_ASSISTANCE });
    },

    onError: (error: Error) => {
      const status = (error as any)?.response?.status;
      if (status !== 422) {
        errorHandlerService.handle(error, {
          context: "SocialAssistance-update",
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
