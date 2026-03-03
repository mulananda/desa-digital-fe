// src/services/events.service.ts
import { axiosInstance } from "@/api/axios";
import { parseRupiah } from "@/helpers/format";
import type { PaginatedResponse } from "@/types/api";
import { Event } from "@/types/event.type";
import { logger } from "@/utils/helpers";
import type {
  CreateEventPayload,
  EventUpdatePayload,
} from "@/schemas/event/event.schema";

export interface EventSearch {
  keyword?: string;
}

/**
 * Validate API response structure sebelum menggunakan
 */
function validateListResponse(data: any): PaginatedResponse<Event> {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response structure from server");
  }

  if (!Array.isArray(data.data)) {
    throw new Error("Response missing data array");
  }

  if (!data.meta || typeof data.meta !== "object") {
    throw new Error("Response missing pagination metadata");
  }

  return data as PaginatedResponse<Event>;
}

/**
 * GET LIST
 * Fetch paginated event
 * ✅ Supports request cancellation
 * ✅ Includes error handling
 * ✅ Validates response structure
 */
export async function fetchEvents(
  params: {
    page: number;
    perPage: number;
    search?: EventSearch;
  },
  options: { signal?: AbortSignal } = {},
): Promise<PaginatedResponse<Event>> {
  try {
    // Validate params
    if (params.page < 1 || params.perPage < 1)
      throw new Error("Invalid pagination parameters");

    const { data } = await axiosInstance.get<{
      data: PaginatedResponse<Event>;
    }>("event/all/paginated", {
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
      `Fetched ${validatedData.data.length} events [page ${params.page}]`,
    );
    return validatedData;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      logger.info("Events fetch was cancelled");
      throw error;
    }
    logger.error("Failed to fetch events:", error);
    throw error;
  }
}

/**
 * GET DETAIL BY ID
 */
export const getEventById = async (id: string): Promise<Event> => {
  const { data } = await axiosInstance.get<{ data: Event }>(`/event/${id}`);
  return data.data;
};

// /**
//  * DELETE
//  */
// export const deleteDevelopment = async (id: string): Promise<void> => {
//   await axiosInstance.delete(`/development/${id}`);
// };

// /**
//  * CREATE DEVELOPMENT
//  * @param payload - Data dari form create (termasuk amount dan thumbnail wajib)
//  */
export const createEvent = async (payload: CreateEventPayload) => {
  const formData = new FormData();

  const entries: Record<string, string | Blob> = {
    thumbnail: payload.thumbnail,
    name: payload.name,
    description: payload.description,
    date: payload.date,
    time: payload.time,
    price: String(payload.price),
    is_active: String(payload.is_active ? 1 : 0),
  };

  for (const [key, value] of Object.entries(entries)) {
    formData.append(key, value);
  }

  const { data } = await axiosInstance.post<{ data: Event }>(
    "/event",
    formData,
  );

  return data.data;
};

/**
 * UPDATE EVENT DESA
 * @param id             - ID EVENT DESA
 * @param payload        - Data dari form (tanpa amount, sudah di-omit dari schema)
 */

export const updateEvent = async (id: string, payload: EventUpdatePayload) => {
  const formData = new FormData();
  formData.append("_method", "PUT");

  const entries: Record<string, string | Blob> = {
    name: payload.name,
    description: payload.description,
    date: payload.date,
    time: payload.time,
    price: String(Math.floor(parseRupiah(payload.price))),
    is_active: String(payload.is_active ? 1 : 0),
  };

  if (payload.thumbnail instanceof File) {
    entries.thumbnail = payload.thumbnail;
  }

  for (const [key, value] of Object.entries(entries)) {
    formData.append(key, value);
  }

  const { data } = await axiosInstance.post<{ data: unknown }>(
    `/event/${id}`,
    formData,
  );
  return data.data;
};
