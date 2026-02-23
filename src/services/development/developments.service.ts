// src/services/development.service.ts
import { axiosInstance } from "@/api/axios";
import type { PaginatedResponse } from "@/types/api";
import type { Development } from "@/types/development.type";
import { logger } from "@/utils/helpers";

export interface DevelopmentSearch {
  keyword?: string;
}

/**
 * Validate API response structure
 */
function validateListResponse(data: any): PaginatedResponse<Development> {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response structure from server");
  }

  if (!Array.isArray(data.data)) {
    throw new Error("Response missing data array");
  }

  if (!data.meta || typeof data.meta !== "object") {
    throw new Error("Response missing pagination metadata");
  }

  return data as PaginatedResponse<Development>;
}

/**
 * Fetch paginated developments with request cancellation support
 */
export async function fetchDevelopments(
  params: {
    page: number;
    perPage: number;
    search?: DevelopmentSearch;
  },
  options: { signal?: AbortSignal } = {},
): Promise<PaginatedResponse<Development>> {
  try {
    if (params.page < 1 || params.perPage < 1) {
      throw new Error("Invalid pagination parameters");
    }

    const { data } = await axiosInstance.get<{
      data: PaginatedResponse<Development>;
    }>("development/all/paginated", {
      params: {
        page: params.page,
        per_page: params.perPage,
        search: params.search?.keyword,
      },
      signal: options.signal,
    });

    const validatedData = validateListResponse(data.data);

    logger.info(
      `Fetched ${validatedData.data.length} developments [page ${params.page}]`,
    );

    return validatedData;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      logger.info("Developments fetch was cancelled");
      throw error;
    }

    logger.error("Failed to fetch developments:", error);
    throw error;
  }
}

/**
 * GET DETAIL BY ID
 */
export const getDevelopmentById = async (id: string): Promise<Development> => {
  const { data } = await axiosInstance.get<{ data: Development }>(
    `/development/${id}`,
  );
  return data.data;
};

/**
 * DELETE BY ID
 */
export const deleteDevelopment = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/development/${id}`);
};
