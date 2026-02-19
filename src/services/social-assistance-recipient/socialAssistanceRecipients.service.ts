// src/services/social-assistance-recipient/socialAssistanceRecipients.service.ts
import { axiosInstance } from "@/api/axios";
import type { PaginatedResponse } from "@/types/api";
import type { SocialAssistanceRecipient } from "@/types/socialAssistanceRecipient.type";
import { logger } from "@/utils/helpers";

export interface RecipientSearch {
  keyword?: string;
}

/**
 * Validate API response structure sebelum menggunakan
 */
function validateListResponse(
  data: any,
): PaginatedResponse<SocialAssistanceRecipient> {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response structure from server");
  }

  if (!Array.isArray(data.data)) {
    throw new Error("Response missing data array");
  }

  if (!data.meta || typeof data.meta !== "object") {
    throw new Error("Response missing pagination metadata");
  }

  return data as PaginatedResponse<SocialAssistanceRecipient>;
}

/**
 * Fetch paginated social assistance recipients
 * ✅ Supports request cancellation
 * ✅ Includes error handling
 * ✅ Validates response structure
 */
export async function fetchSocialAssistanceRecipients(
  params: {
    page: number;
    perPage: number;
    search?: RecipientSearch;
  },
  options: { signal?: AbortSignal } = {},
): Promise<PaginatedResponse<SocialAssistanceRecipient>> {
  try {
    // Validate params
    if (params.page < 1 || params.perPage < 1) {
      throw new Error("Invalid pagination parameters");
    }

    const { data } = await axiosInstance.get<{
      data: PaginatedResponse<SocialAssistanceRecipient>;
    }>("social-assistance-recipient/all/paginated", {
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
      `Fetched ${validatedData.data.length} recipients [page ${params.page}]`,
    );

    return validatedData;
  } catch (error) {
    // Check if request was aborted (user navigation)
    if (error instanceof Error && error.name === "AbortError") {
      logger.info("Recipients fetch was cancelled");
      throw error; // Re-throw untuk TanStack handle gracefully
    }

    // Log actual error untuk debugging
    logger.error("Failed to fetch recipients:", error);

    // Re-throw untuk axios interceptor handle
    throw error;
  }
}
