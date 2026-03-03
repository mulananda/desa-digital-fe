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
const priceFromInput = z.coerce
  .number({ message: "Harga wajib berupa angka" })
  .min(1, "Harga wajib diisi");

// ---------- Checkbox Boolean ----------
const checkboxBoolean = z.preprocess((val) => {
  if (val === "on" || val === "true" || val === true) return true;
  if (val === "false" || val === false) return false;
  return val;
}, z.boolean());

// ---------- Main Schema ----------
// Schema validasi untuk form CREATE EVENT
export const eventFormSchema = z.object({
  thumbnail: fileSchema,
  name: z.string().trim().min(1, "Nama event wajib diisi"),
  description: z.string().trim().min(1, "Deskripsi wajib diisi"),
  date: z.string().min(1, "Tanggal mulai wajib diisi"),
  time: z.string().min(1, "Waktu event wajib diisi"),
  price: priceFromInput,
  is_active: checkboxBoolean.default(true),
});

// ---------- Types ----------
// Type output setelah zod memvalidasi & mentransformasi data form CREATE
export type CreateEventPayload = z.output<typeof eventFormSchema>;

// Type raw input form CREATE — sebelum divalidasi zod
// (nilai awal/default form, bisa berisi string kosong, null, dll)
export type EventFormInput = {
  thumbnail: File | null;
  name: string;
  description: string;
  date: string;
  time: string;
  price: string | number; // string karena berasal dari <input>, number setelah diparse
  is_active: boolean;
};

// Compile-time guard: memastikan semua key EventFormInput
// ada di CreateEventPayload — error saat build jika ada field yang hilang
type _GuardKeys = keyof EventFormInput extends keyof CreateEventPayload
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
 * Schema validasi untuk form UPDATE event.
 *
 * Perbedaan dengan eventFormSchema (CREATE):
 * - thumbnail → diganti fileSchemaOptional (boleh null jika tidak ganti)
 * - amount    → di-omit, tidak ada input amount di form edit.
 *               Nilai amount diambil dari data existing dan dikirim langsung di service.
 */
export const eventUpdateSchema = eventFormSchema.extend({
  thumbnail: fileSchemaOptional,
});

// Type output setelah zod memvalidasi & mentransformasi data form UPDATE
export type EventUpdatePayload = z.output<typeof eventUpdateSchema>;

/*
 * Type raw input form UPDATE — sebelum divalidasi zod.
 *
 * Perbedaan dengan EventFormInput (CREATE):
 * - thumbnail → File | null  (null = tidak ganti, pakai thumbnail lama)
 * - amount    → tetap ada sebagai carrier data ke service,
 *               tapi tidak divalidasi oleh zod (di-omit dari schema)
 */
export type EventUpdateFormInput = Omit<
  EventFormInput,
  "thumbnail" | "amount" // keduanya di-omit untuk didefinisikan ulang di bawah
> & {
  thumbnail: File | null; // null = tidak ganti thumbnail
};
