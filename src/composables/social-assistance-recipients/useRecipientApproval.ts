import { useMutation, useQueryClient } from "@tanstack/vue-query";
import {
  approveRecipient,
  rejectRecipient,
  type ApprovePayload,
  type RejectPayload,
} from "@/services/social-assistance-recipient/socialAssistanceRecipientApproval.service";
import { socialAssistanceRecipientKeys } from "@/queryKeys/socialAssistanceRecipient.keys";
import { notificationService } from "@/services/notification.service";

export function useRecipientApproval(id: string) {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: (payload: ApprovePayload) => approveRecipient(id, payload),

    onSuccess: (res) => {
      notificationService.success("Pengajuan Bansos Berhasil Disetujui");

      // refresh list
      queryClient.invalidateQueries({
        queryKey: socialAssistanceRecipientKeys.detail(id),
      });
    },

    onError: (error: any) => {
      notificationService.error(
        error?.response?.data?.message ?? "Gagal menyetujui data",
      );
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (payload: RejectPayload) => rejectRecipient(id, payload),

    onSuccess: (res) => {
      notificationService.success("Pengajuan Bansos Berhasil Ditolak");

      queryClient.invalidateQueries({
        queryKey: socialAssistanceRecipientKeys.detail(id),
      });
    },
    onError: (error: any) => {
      notificationService.error(
        error?.response?.data?.message ?? "Gagal menolak data",
      );
    },
  });

  return {
    approve: approveMutation.mutate,
    reject: rejectMutation.mutate,

    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,

    approveError: approveMutation.error,
    rejectError: rejectMutation.error,
  };
}
