// src/services/social-assistance/socialAssistance.service.ts
import { axiosInstance } from "@/api/axios";
import type { PaginatedResponse } from "@/types/api";
import { logger } from "@/utils/helpers";
import type { SocialAssistance } from "@/types/socialAssistance.type";
import { CreateSocialAssistancePayload } from "@/schemas/social-assistance/socialAssistance.schema";

export interface SocialAssistanceSearch {
  keyword?: string;
}

/**
 * Validate API response structure sebelum menggunakan
 */
function validateListResponse(data: any): PaginatedResponse<SocialAssistance> {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response structure from server");
  }

  if (!Array.isArray(data.data)) {
    throw new Error("Response missing data array");
  }

  if (!data.meta || typeof data.meta !== "object") {
    throw new Error("Response missing pagination metadata");
  }

  return data as PaginatedResponse<SocialAssistance>;
}

/**
 * GET LIST
 * Fetch paginated social assistances
 * ✅ Supports request cancellation
 * ✅ Includes error handling
 * ✅ Validates response structure
 */
export async function fetchSocialAssistances(
  params: {
    page: number;
    perPage: number;
    search?: SocialAssistanceSearch;
  },
  options: { signal?: AbortSignal } = {},
): Promise<PaginatedResponse<SocialAssistance>> {
  try {
    // Validate params
    if (params.page < 1 || params.perPage < 1) {
      throw new Error("Invalid pagination parameters");
    }

    const { data } = await axiosInstance.get<{
      data: PaginatedResponse<SocialAssistance>;
    }>("social-assistance/all/paginated", {
      params: {
        page: params.page,
        per_page: params.perPage,
        search: params.search?.keyword,
      },
      signal: options.signal, // ✅ NEW: Pass abort signal
    });

    // ✅ NEW: Validate response structure
    const validatedData = validateListResponse(data.data);

    logger.info(
      `Fetched ${validatedData.data.length} social assistances [page ${params.page}]`,
    );

    return validatedData;
  } catch (error) {
    // Check if request was aborted (user navigation)
    if (error instanceof Error && error.name === "AbortError") {
      logger.info("Social assistances fetch was cancelled");
      throw error; // Re-throw untuk TanStack handle gracefully
    }

    // Log actual error untuk debugging
    logger.error("Failed to fetch social assistances:", error);

    // Re-throw untuk axios interceptor handle
    throw error;
  }
}

/**
 * GET DETAIL BY ID
 */
export const getSocialAssistanceById = async (
  id: string,
): Promise<SocialAssistance> => {
  const { data } = await axiosInstance.get(`/social-assistance/${id}`);

  /**
   * Best practice:
   * - Return hanya data yang dipakai UI
   * - Jangan return whole axios response
   */
  return data.data ?? data;
};

/**
 * DELETE
 */
export const deleteSocialAssistance = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/social-assistance/${id}`);
};

/**
 * CREATE
 */
export const createSocialAssistance = async (
  payload: CreateSocialAssistancePayload,
) => {
  const formData = new FormData();

  // Laravel best practice: boolean sebagai 1/0 untuk FormData/multipart
  const entries: Record<string, string | Blob> = {
    thumbnail: payload.thumbnail,
    name: payload.name,
    category: payload.category,
    amount: String(payload.amount),
    provider: payload.provider,
    description: payload.description,
    is_available: String(payload.is_available ? 1 : 0),
  };

  for (const [key, value] of Object.entries(entries)) {
    formData.append(key, value);
  }

  const { data } = await axiosInstance.post<{ data: unknown }>(
    "/social-assistance",
    formData,
  );

  return data.data;
};
