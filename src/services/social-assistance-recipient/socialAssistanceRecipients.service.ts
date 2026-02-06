// src/services/socialAssistanceRecipients.service.ts
import { axiosInstance } from "@/api/axios";
import type { PaginatedResponse } from "@/types/api";
import type { SocialAssistanceRecipient } from "@/types/socialAssistanceRecipient.type";

export interface RecipientSearch {
  keyword?: string;
}

export async function fetchSocialAssistanceRecipients(params: {
  page: number;
  perPage: number;
  search?: RecipientSearch;
}): Promise<PaginatedResponse<SocialAssistanceRecipient>> {
  const { data } = await axiosInstance.get(
    "social-assistance-recipient/all/paginated",
    {
      params: {
        page: params.page,
        per_page: params.perPage,
        search: params.search?.keyword,
      },
    },
  );

  return data.data;
}
