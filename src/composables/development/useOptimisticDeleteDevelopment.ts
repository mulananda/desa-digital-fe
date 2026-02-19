import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { deleteDevelopment } from "@/services/development/development.service";
import { developmentKeys } from "@/queryKeys/development.keys";
import { notificationService } from "@/services/notification.service";

export const useDeleteDevelopment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteDevelopment(id),

    // Optimistic update: remove item locally before server confirms
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: developmentKeys.lists() });

      const previousLists = queryClient.getQueriesData
        ? queryClient.getQueriesData({ queryKey: developmentKeys.lists() })
        : [];

      // Remove the item from any matching list queries
      previousLists.forEach(([key, data]: any) => {
        queryClient.setQueryData(key, (old: any) => {
          if (!old) return old;

          // support shapes: Array, { data: Array }, or other wrapper
          const arr = Array.isArray(old) ? old : (old.data ?? old);
          if (!Array.isArray(arr)) return old;

          const filtered = arr.filter((d: any) => String(d.id) !== String(id));

          if (Array.isArray(old)) return filtered;
          if (old && typeof old === "object" && "data" in old) {
            return { ...old, data: filtered };
          }

          return filtered;
        });
      });

      const detailKey = developmentKeys.details(id);
      const previousDetail = queryClient.getQueryData(detailKey);
      queryClient.setQueryData(detailKey, undefined);

      return { previousLists, previousDetail };
    },

    onError: (_err, id, context: any) => {
      // rollback
      if (context?.previousLists) {
        context.previousLists.forEach(([key, value]: any) => {
          queryClient.setQueryData(key, value);
        });
      }

      if (context?.previousDetail) {
        queryClient.setQueryData(
          developmentKeys.details(id),
          context.previousDetail,
        );
      }

      notificationService.error("Gagal menghapus data");
    },

    onSettled: (_data, _err, id) => {
      // Ensure fresh data
      queryClient.invalidateQueries({ queryKey: developmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: developmentKeys.details(id) });

      notificationService.success("Data berhasil dihapus");
    },
  });

  return {
    deleteDevelopment: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    isPending: mutation.isPending,
    deleteError: mutation.error,
  };
};

export default useDeleteDevelopment;
