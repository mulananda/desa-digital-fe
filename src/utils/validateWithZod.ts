// src/utils/validateWithZod.ts
import { type z } from "zod";

export function validateWithZod<TOutput>(
  schema: z.ZodType<TOutput>, // ← ganti ZodTypeAny → z.ZodType<TOutput>
  data: unknown,
):
  | { success: true; data: TOutput; errors: Record<string, never> }
  | { success: false; data: null; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data, errors: {} };
  }

  const fieldErrors: Record<string, string> = {};

  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    if (!fieldErrors[path]) {
      fieldErrors[path] = issue.message;
    }
  }

  return { success: false, data: null, errors: fieldErrors };
}
