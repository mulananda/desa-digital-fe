// src/composables/development/useDeleteDevelopments.ts
import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { developmentKeys } from "@/queryKeys/development.keys";
import { notificationService } from "@/services/notification.service";
import { deleteDevelopment } from "@/services/development/developments.service";

export const useDeleteDevelopment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteDevelopment(id),

    // ✅ hanya tampilkan notif setelah server confirm
    onSuccess: (_data, id) => {
      notificationService.success("Data berhasil dihapus");

      // baru refresh list
      queryClient.invalidateQueries({
        queryKey: developmentKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey: developmentKeys.detail(id),
      });
    },

    onError: () => {
      notificationService.error("Gagal menghapus data");
    },
  });

  return {
    deleteDevelopment: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
};
