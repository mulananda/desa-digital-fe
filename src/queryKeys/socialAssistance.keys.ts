// src/queryKeys/socialAssistance.keys.ts

import { sanitizeSearchParam } from "@/utils/sanitization";

export interface SocialAssistanceListParams {
  keyword?: string;
  page: number;
  perPage: number;
}

export const socialAssistanceKeys = {
  all: ["social-assistance"] as const,

  lists: () => [...socialAssistanceKeys.all, "list"] as const,

  list: (params: SocialAssistanceListParams) =>
    [
      ...socialAssistanceKeys.lists(),
      sanitizeSearchParam(params.keyword), // ✅ NEW: Double sanitization
      params.page,
      params.perPage,
    ] as const,

  detail: (id: string) => [...socialAssistanceKeys.all, "detail", id] as const,
};
