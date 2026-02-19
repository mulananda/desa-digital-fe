import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { notificationService } from "@/services/notification.service";
import { deleteSocialAssistance } from "@/services/social-assistance/socialAssistances.service";
import { socialAssistanceKeys } from "@/queryKeys/socialAssistance.keys";
import { useRouter } from "vue-router";
import { ROUTE_NAMES } from "@/config/routes.config";

export const useDeleteSocialAssistance = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteSocialAssistance(id),

    // ✅ hanya tampilkan notif setelah server confirm
    onSuccess: (_data, id) => {
      notificationService.success("Data berhasil dihapus");

      // baru refresh list
      queryClient.invalidateQueries({
        queryKey: socialAssistanceKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey: socialAssistanceKeys.detail(id),
      });

      router.replace({ name: ROUTE_NAMES.SOCIAL_ASSISTANCE });
    },

    onError: () => {
      notificationService.error("Gagal menghapus data");
    },
  });

  return {
    deleteSocialAssistance: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
};
