// src/composables/social-assistance-recipients/useRecipientApproval.ts
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

  // Shared invalidation — DRY
  function invalidateDetail() {
    queryClient.invalidateQueries({
      queryKey: socialAssistanceRecipientKeys.detail(id),
    });
  }

  // Shared error handler — DRY
  function handleError(error: unknown, fallbackMessage: string) {
    const message = (error as any)?.response?.data?.message ?? fallbackMessage;
    notificationService.error(message);
  }

  const approveMutation = useMutation({
    mutationFn: (payload: ApprovePayload) => approveRecipient(id, payload),

    onSuccess: () => {
      notificationService.success("Pengajuan Bansos Berhasil Disetujui");
      invalidateDetail();
    },

    onError: (error: unknown) => {
      handleError(error, "Gagal menyetujui data");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (payload: RejectPayload) => rejectRecipient(id, payload),

    onSuccess: () => {
      notificationService.success("Pengajuan Bansos Berhasil Ditolak");
      invalidateDetail();
    },

    onError: (error: unknown) => {
      handleError(error, "Gagal menolak data");
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
