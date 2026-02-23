// src/utils/extractBackendErrors.ts

/**
 * Extract field errors dari Laravel 422 response
 * Input:  { errors: { field: string[] } }
 * Output: { field: string } — ambil pesan pertama per field
 */
export function extractBackendErrors(
  error: unknown,
): Record<string, string> | null {
  const errors = (error as any)?.response?.data?.errors as
    | Record<string, string[]>
    | undefined;

  if (!errors || typeof errors !== "object") return null;

  return Object.fromEntries(
    Object.entries(errors).map(([key, messages]) => [
      key,
      Array.isArray(messages) ? messages[0] : messages,
    ]),
  );
}
