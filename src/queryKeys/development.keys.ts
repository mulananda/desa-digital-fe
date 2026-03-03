import { sanitizeSearchParam } from "@/utils/sanitization";

// src/queryKeys/development.keys.ts
export interface DevelopmentListParams {
  keyword?: string;
  page: number;
  perPage: number;
}

export const developmentKeys = {
  all: ["development"] as const,

  lists: () => [...developmentKeys.all, "list"] as const,

  list: (params: DevelopmentListParams) =>
    [
      ...developmentKeys.lists(),
      sanitizeSearchParam(params.keyword), // ✅ NEW: Double sanitization
      params.page,
      params.perPage,
    ] as const,

  detail: (id: string) => [...developmentKeys.all, "detail", id] as const,
};
