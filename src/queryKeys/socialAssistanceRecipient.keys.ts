// src/queryKeys/socialAssistanceRecipient.keys.ts
import { sanitizeSearchParam } from "@/utils/sanitization";

export interface SocialAssistanceRecipientListParams {
  keyword?: string;
  page: number;
  perPage: number;
}

export const socialAssistanceRecipientKeys = {
  all: ["social-assistance-recipient"] as const,

  lists: () => [...socialAssistanceRecipientKeys.all, "list"] as const,

  list: (params: SocialAssistanceRecipientListParams) =>
    [
      ...socialAssistanceRecipientKeys.lists(),
      sanitizeSearchParam(params.keyword), // ✅ NEW: Double sanitization
      params.page,
      params.perPage,
    ] as const,

  detail: (id: string) =>
    [...socialAssistanceRecipientKeys.all, "detail", id] as const,
};
