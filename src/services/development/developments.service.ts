// src/services/development.service.ts
import { axiosInstance } from "@/api/axios";
import type { PaginatedResponse } from "@/types/api";
import type { Development } from "@/types/development.type";
import type { DevelopmentUpdatePayload } from "@/schemas/development/development.schema";
import dayjs from "dayjs";
import { logger } from "@/utils/helpers";
import { parseRupiah } from "@/helpers/format";

export interface DevelopmentSearch {
  keyword?: string;
}

/**
 * Validate API response structure sebelum menggunakan
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
 * GET LIST
 * Fetch paginated social assistances
 * ✅ Supports request cancellation
 * ✅ Includes error handling
 * ✅ Validates response structure
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
    // Validate params
    if (params.page < 1 || params.perPage < 1)
      throw new Error("Invalid pagination parameters");

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

    // ✅ NEW: Validate response structure
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
 * DELETE
 */
export const deleteDevelopment = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/development/${id}`);
};

/**
 * CREATE DEVELOPMENT
 *
 * Konversi:
 *   start_date + days_needed → end_date (dikirim ke backend)
 *   days_needed              → TIDAK dikirim (tidak ada kolom di DB)
 *
 * @param payload - Data dari form create (termasuk amount dan thumbnail wajib)
 */
export const createDevelopment = async (
  payload: import("@/schemas/development/development.schema").CreateDevelopmentPayload,
) => {
  /*
   * Hitung end_date dari start_date + days_needed
   *
   * Contoh:
   *   start_date = "2024-01-01", days_needed = 30
   *   end_date   = "2024-01-01" + 29 hari = "2024-01-30" ✅
   */
  const endDate = dayjs(payload.start_date)
    .add(payload.days_needed - 1, "day")
    .format("YYYY-MM-DD");

  const formData = new FormData();

  const entries: Record<string, string | Blob> = {
    name: payload.name,
    person_in_charge: payload.person_in_charge,
    description: payload.description,
    start_date: payload.start_date,
    end_date: endDate, // ← hasil konversi dari days_needed
    amount: String(payload.amount),
    status: payload.status,
    thumbnail: payload.thumbnail, // ← wajib ada di create
    // days_needed ← tidak dikirim, tidak ada kolom di DB
  };

  for (const [key, value] of Object.entries(entries)) {
    formData.append(key, value);
  }

  const { data } = await axiosInstance.post<{ data: Development }>(
    "/development",
    formData,
  );

  return data.data;
};

/**
 * UPDATE DEVELOPMENT
 *
 * Konversi:
 *   start_date + days_needed → end_date (dikirim ke backend)
 *   days_needed              → TIDAK dikirim (tidak ada kolom di DB)
 *   amount                   → diambil dari originalAmount (tidak ada inputan di form edit)
 *
 * @param id             - ID development
 * @param payload        - Data dari form (tanpa amount, sudah di-omit dari schema)
 * @param originalAmount - Amount dari data existing (development.value.amount)
 */
export const updateDevelopment = async (
  id: string,
  payload: DevelopmentUpdatePayload,
  originalAmount: string | number,
) => {
  /*
   * Hitung end_date dari start_date + days_needed
   * subtract(1) karena hari pertama (start_date) sudah terhitung sebagai hari ke-1
   *
   * Contoh:
   *   start_date = "2024-01-01", days_needed = 30
   *   end_date   = "2024-01-01" + 29 hari = "2024-01-30" ✅
   */
  const endDate = dayjs(payload.start_date)
    .add(payload.days_needed - 1, "day")
    .format("YYYY-MM-DD");

  /*
   * Parse amount dari data existing:
   * - parseRupiah → hapus separator ribuan, konversi ke number
   * - Math.floor  → pastikan bilangan bulat (backend Laravel expect integer)
   *
   * Contoh: "835.116,89" → 835116.89 → 835116
   */
  const parsedAmount = Math.floor(parseRupiah(originalAmount) ?? 0);

  const formData = new FormData();
  formData.append("_method", "PUT");

  const entries: Record<string, string | Blob> = {
    name: payload.name,
    person_in_charge: payload.person_in_charge,
    description: payload.description,
    start_date: payload.start_date,
    end_date: endDate, // ← hasil konversi dari days_needed
    amount: String(parsedAmount), // ← dari data existing, bukan form input
    status: payload.status,
    // days_needed ← tidak dikirim, tidak ada kolom di DB
  };

  if (payload.thumbnail instanceof File) {
    entries.thumbnail = payload.thumbnail;
  }

  for (const [key, value] of Object.entries(entries)) {
    formData.append(key, value);
  }

  const { data } = await axiosInstance.post<{ data: unknown }>(
    `/development/${id}`,
    formData,
  );
  return data.data;
};
