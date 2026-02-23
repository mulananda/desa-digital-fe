// src/schemas/social-assistance/socialAssistance.schema.ts
import { z } from "zod";

// ---------- Constants ----------
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const SOCIAL_ASSISTANCE_CATEGORIES = [
  "staple",
  "cash",
  "subsidized fuel",
  "health",
] as const;

export type SocialAssistanceCategory =
  (typeof SOCIAL_ASSISTANCE_CATEGORIES)[number];

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
const numberFromInput = z.coerce
  .number({ message: "Nominal wajib berupa angka" })
  .min(1, "Nominal wajib diisi");

// ---------- Checkbox Boolean ----------
const checkboxBoolean = z.preprocess((val) => {
  if (val === "on" || val === "true" || val === true) return true;
  if (val === "false" || val === false) return false;
  return val;
}, z.boolean());

// ---------- Main Schema ----------
export const socialAssistanceFormSchema = z.object({
  thumbnail: fileSchema,
  name: z.string().trim().min(1, "Judul bantuan sosial wajib diisi"),
  category: z.enum(SOCIAL_ASSISTANCE_CATEGORIES, {
    message: "Kategori tidak valid",
  }),
  amount: numberFromInput,
  provider: z.string().trim().min(1, "Penyedia bantuan sosial wajib diisi"),
  description: z.string().trim().min(1, "Deskripsi wajib diisi"),
  // description: z.string().trim().optional(),
  is_available: checkboxBoolean.default(true),
});

// ---------- Types ----------
export type CreateSocialAssistancePayload = z.output<
  typeof socialAssistanceFormSchema
>;

// Manual input type karena z.coerce.number() → input unknown di Zod v4
export type SocialAssistanceFormInput = {
  thumbnail: File | null;
  name: string;
  category: SocialAssistanceCategory | ""; // "" = belum dipilih
  amount: string | number;
  provider: string;
  description: string;
  is_available: boolean;
};

// Compile-time guard: FormInput key harus subset dari payload
type _GuardKeys =
  keyof SocialAssistanceFormInput extends keyof CreateSocialAssistancePayload
    ? true
    : never;
const _guard: _GuardKeys = true;

// ---------------------------------------------------------------------------------------------------

// ---------- File Schema untuk Update (nullable) ----------
const fileSchemaOptional = z
  .custom<File | null>(
    (val) => {
      // null = tidak ganti thumbnail → valid
      if (val === null || val === undefined) return true;
      // Ada file → validasi seperti biasa
      return typeof window !== "undefined"
        ? val instanceof File && val.size > 0
        : val instanceof Object && "size" in val && (val as any).size > 0;
    },
    { message: "File tidak valid" },
  )
  .refine(
    (file) => {
      if (!file) return true; // null → skip
      return file.size <= MAX_FILE_SIZE;
    },
    { message: "Ukuran file maksimal 2MB" },
  )
  .refine(
    (file) => {
      if (!file) return true; // null → skip
      return (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type);
    },
    { message: "Format harus jpg, jpeg, png, atau webp" },
  );

// Update: thumbnail opsional (tidak wajib ganti gambar) dan teteap ada validasi max size
export const socialAssistanceUpdateSchema = socialAssistanceFormSchema.extend({
  thumbnail: fileSchemaOptional,
});

export type SocialAssistanceUpdatePayload = z.output<
  typeof socialAssistanceUpdateSchema
>;

export type SocialAssistanceUpdateFormInput = Omit<
  SocialAssistanceFormInput,
  "thumbnail"
> & {
  thumbnail: File | null; // null = tidak ganti thumbnail
};
