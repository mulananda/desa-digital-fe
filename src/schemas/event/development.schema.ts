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

// Status yang tersedia untuk pembangunan
export const DEVELOPMENT_STATUSES = ["ongoing", "completed"] as const;

// Type union dari status yang tersedia: "ongoing" | "completed"
export type DevelopmentStatus = (typeof DEVELOPMENT_STATUSES)[number];

// ---------- File Schema (SSR-safe) ----------
// Validasi file thumbnail — aman dipakai di SSR maupun browser
const fileSchema = z
  .custom<File>(
    (val) =>
      // Di browser: cek instanceof File, di SSR: cek duck-typing (ada property size)
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
// Coerce string → number (dari input HTML yang selalu mengembalikan string)
const amountFromInput = z.coerce
  .number({ message: "Anggaran wajib berupa angka" })
  .min(1, "Anggaran wajib diisi");

const numberFromInput = z.coerce
  .number({ message: "Hari wajib berupa angka" })
  .min(1, "Hari wajib diisi");

// ---------- Main Schema ----------
// Schema validasi untuk form CREATE pembangunan
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
// Type output setelah zod memvalidasi & mentransformasi data form CREATE
export type CreateDevelopmentPayload = z.output<typeof developmentFormSchema>;

// Type raw input form CREATE — sebelum divalidasi zod
// (nilai awal/default form, bisa berisi string kosong, null, dll)
export type DevelopmentFormInput = {
  thumbnail: File | null;
  name: string;
  person_in_charge: string;
  description: string;
  start_date: string;
  end_date: string;
  days_needed: number | null;
  amount: string | number; // string karena berasal dari <input>, number setelah diparse
  status: DevelopmentStatus | ""; // "" = belum dipilih
};

// Compile-time guard: memastikan semua key DevelopmentFormInput
// ada di CreateDevelopmentPayload — error saat build jika ada field yang hilang
type _GuardKeys =
  keyof DevelopmentFormInput extends keyof CreateDevelopmentPayload
    ? true
    : never;
const _guard: _GuardKeys = true;

// ---------------------------------------------------------------------------------------------------

// ---------- File Schema untuk Update (nullable) ----------
// Sama seperti fileSchema, tapi null/undefined diperbolehkan
// (null = user tidak mengganti thumbnail, pakai yang lama)
const fileSchemaOptional = z
  .custom<File | null>(
    (val) => {
      if (val === null || val === undefined) return true; // skip validasi jika tidak ada file baru
      return typeof window !== "undefined"
        ? val instanceof File && val.size > 0
        : val instanceof Object && "size" in val && (val as any).size > 0;
    },
    { message: "File tidak valid" },
  )
  .refine(
    (file) => {
      if (!file) return true; // skip jika null
      return file.size <= MAX_FILE_SIZE;
    },
    { message: "Ukuran file maksimal 2MB" },
  )
  .refine(
    (file) => {
      if (!file) return true; // skip jika null
      return (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type);
    },
    { message: "Format harus jpg, jpeg, png, atau webp" },
  );

/*
 * Schema validasi untuk form UPDATE pembangunan.
 *
 * Perbedaan dengan developmentFormSchema (CREATE):
 * - thumbnail → diganti fileSchemaOptional (boleh null jika tidak ganti)
 * - amount    → di-omit, tidak ada input amount di form edit.
 *               Nilai amount diambil dari data existing dan dikirim langsung di service.
 */
export const developmentUpdateSchema = developmentFormSchema
  .extend({ thumbnail: fileSchemaOptional })
  .omit({ amount: true });

// Type output setelah zod memvalidasi & mentransformasi data form UPDATE
export type DevelopmentUpdatePayload = z.output<typeof developmentUpdateSchema>;

/*
 * Type raw input form UPDATE — sebelum divalidasi zod.
 *
 * Perbedaan dengan DevelopmentFormInput (CREATE):
 * - thumbnail → File | null  (null = tidak ganti, pakai thumbnail lama)
 * - amount    → tetap ada sebagai carrier data ke service,
 *               tapi tidak divalidasi oleh zod (di-omit dari schema)
 */
export type DevelopmentUpdateFormInput = Omit<
  DevelopmentFormInput,
  "thumbnail" | "amount" // keduanya di-omit untuk didefinisikan ulang di bawah
> & {
  thumbnail: File | null; // null = tidak ganti thumbnail
  amount: string | number; // tetap ada tapi tidak divalidasi schema
};
