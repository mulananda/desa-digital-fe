import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { deleteDevelopment } from "@/services/development/development.service";
import { developmentKeys } from "@/queryKeys/development.keys";
import { notificationService } from "@/services/notification.service";

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
        queryKey: developmentKeys.details(id),
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
