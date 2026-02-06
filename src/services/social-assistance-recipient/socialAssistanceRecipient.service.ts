// src/services/social-assistance-recipient/socialAssistanceRecipient.service.ts
import { axiosInstance } from "@/api/axios";
import type { SocialAssistanceRecipient } from "@/types/socialAssistanceRecipient.type";

/* ================= API ================= */
export const getSocialAssistanceRecipientById = async (
  id: string,
): Promise<SocialAssistanceRecipient> => {
  const { data } = await axiosInstance.get(
    `/social-assistance-recipient/${id}`,
  );

  /**
   * Best practice:
   * - Return hanya data yang dipakai UI
   * - Jangan return whole axios response
   */
  return data.data ?? data;
};
