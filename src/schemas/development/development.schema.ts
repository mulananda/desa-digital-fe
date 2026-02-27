// src/schemas/development/development.schema.ts
import { z } from "zod";

// ---------- Constants ----------
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const DEVELOPMENT_STATUSES = ["ongoing", "completed"] as const;

export type DevelopmentStatus = (typeof DEVELOPMENT_STATUSES)[number];

// ---------- File Schema (SSR-safe) ----------
const fileSchema = z
  .custom<File>(
    (val) =>
      typeof window !== "undefined"
        ? val instanceof File && val.size > 0
        : val instanceof Object && "size" in val && (val as any).size > 0,
    { message: "File wajib diunggah" },
  )
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "Ukuran file maksimal 2MB",
  })
  .refine(
    (file) => (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type),
    { message: "Format harus jpg, jpeg, png, atau webp" },
  );

// ---------- Number ----------
const amountFromInput = z.coerce
  .number({ message: "Anggaran wajib berupa angka" })
  .min(1, "Anggaran wajib diisi");

const numberFromInput = z.coerce
  .number({ message: "Hari wajib berupa angka" })
  .min(1, "Hari wajib diisi");

// ---------- Main Schema ----------
export const developmentFormSchema = z.object({
  thumbnail: fileSchema,
  name: z.string().trim().min(1, "Nama pembangunan wajib diisi"),
  person_in_charge: z.string().trim().min(1, "Penanggung jawab wajib diisi"),
  description: z.string().trim().min(1, "Deskripsi wajib diisi"),
  start_date: z.string().min(1, "Tanggal mulai wajib diisi"),
  end_date: z.string().min(1, "Tanggal selesai wajib diisi"),
  amount: amountFromInput,
  days_needed: numberFromInput,
  status: z.enum(DEVELOPMENT_STATUSES, {
    message: "Status tidak valid",
  }),
});

// ---------- Types ----------
export type CreateDevelopmentPayload = z.output<typeof developmentFormSchema>;

export type DevelopmentFormInput = {
  thumbnail: File | null;
  name: string;
  person_in_charge: string;
  description: string;
  start_date: string;
  end_date: string;
  days_needed: number | null;
  amount: string | number;
  status: DevelopmentStatus | "";
};

// Compile-time guard
type _GuardKeys =
  keyof DevelopmentFormInput extends keyof CreateDevelopmentPayload
    ? true
    : never;
const _guard: _GuardKeys = true;

// ---------------------------------------------------------------------------------------------------

// ---------- File Schema untuk Update (nullable) ----------
const fileSchemaOptional = z
  .custom<File | null>(
    (val) => {
      if (val === null || val === undefined) return true;
      return typeof window !== "undefined"
        ? val instanceof File && val.size > 0
        : val instanceof Object && "size" in val && (val as any).size > 0;
    },
    { message: "File tidak valid" },
  )
  .refine(
    (file) => {
      if (!file) return true;
      return file.size <= MAX_FILE_SIZE;
    },
    { message: "Ukuran file maksimal 2MB" },
  )
  .refine(
    (file) => {
      if (!file) return true;
      return (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type);
    },
    { message: "Format harus jpg, jpeg, png, atau webp" },
  );

/*
 * Update schema:
 * - thumbnail → optional (boleh null jika tidak ganti)
 * - amount    → di-omit karena tidak ada inputan di form edit,
 *               nilai dikirim langsung dari data existing di service
 */
export const developmentUpdateSchema = developmentFormSchema
  .extend({ thumbnail: fileSchemaOptional })
  .omit({ amount: true });

export type DevelopmentUpdatePayload = z.output<typeof developmentUpdateSchema>;

/*
 * Form input type untuk halaman edit.
 * amount tetap ada di form (untuk dikirim ke service),
 * tapi tidak divalidasi oleh zod — hanya sebagai carrier data.
 */
export type DevelopmentUpdateFormInput = Omit<
  DevelopmentFormInput,
  "amount"
> & {
  amount: string | number; // tetap ada di form, tapi tidak divalidasi schema
};
