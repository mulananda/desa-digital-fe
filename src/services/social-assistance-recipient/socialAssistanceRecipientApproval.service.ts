// src/services/social-assistance-recipient/socialAssistanceRecipientApproval.service.ts
import { axiosInstance } from "@/api/axios";

export interface ApprovePayload {
  status: "approved";
  proof: File;
}

export interface RejectPayload {
  status: "reject";
  rejection_reason: string;
}

export const approveRecipient = async (id: string, payload: ApprovePayload) => {
  const formData = new FormData();
  formData.append("status", payload.status);
  formData.append("proof", payload.proof);

  const { data } = await axiosInstance.post(
    `/social-assistance-recipient/${id}/approve`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return data;
};

export const rejectRecipient = async (id: string, payload: RejectPayload) => {
  const { data } = await axiosInstance.post(
    `/social-assistance-recipient/${id}/reject`,
    payload,
  );

  return data;
};
