import { sanitizeSearchParam } from "@/utils/sanitization";

// src/queryKeys/event.keys.ts
export interface EventListParams {
  keyword?: string;
  page: number;
  perPage: number;
}

export const eventKeys = {
  all: ["event"] as const,

  lists: () => [...eventKeys.all, "list"] as const,

  list: (params: EventListParams) =>
    [
      ...eventKeys.lists(),
      sanitizeSearchParam(params.keyword), // ✅ NEW: Double sanitization
      params.page,
      params.perPage,
    ] as const,

  detail: (id: string) => [...eventKeys.all, "detail", id] as const,
};
