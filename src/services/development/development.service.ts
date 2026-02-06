// src/services/development.service.ts
import { axiosInstance } from "@/api/axios";
import type { PaginatedResponse } from "@/types/api";
import type { Development } from "@/types/development.type";

export interface DevelopmentSearch {
  keyword?: string;
}

export async function fetchDevelopments(params: {
  page: number;
  perPage: number;
  search?: DevelopmentSearch;
}): Promise<PaginatedResponse<Development>> {
  const { data } = await axiosInstance.get("development/all/paginated", {
    params: {
      page: params.page,
      per_page: params.perPage,
      search: params.search?.keyword,
    },
  });

  return data.data;
}
