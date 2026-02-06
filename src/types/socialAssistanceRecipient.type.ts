// src/types/socialAssistanceRecipient.type.ts

import type { HeadOfFamily } from "./headOfFamily.type";
import type { SocialAssistance } from "./socialAssistance.type";
import type { SocialAssistanceRecipientStatus } from "./socialAssistanceRecipientStatus.type";

export interface SocialAssistanceRecipient {
  /* ================= ID ================= */
  id: string;

  /* ================= DOMAIN ================= */
  status: SocialAssistanceRecipientStatus;

  amount: number;
  reason?: string;

  bank?: "bca" | "bni" | "bri" | "mandiri";
  account_number?: number;

  proof?: string | null;

  /* ================= AUDIT ================= */
  approved_at?: string | null;
  approved_by?: string | null;

  rejected_at?: string | null;
  rejected_by?: string | null;
  rejection_reason?: string | null;

  created_at: string;
  updated_at?: string;

  /* ================= RELATION ================= */
  social_assistance?: SocialAssistance;
  head_of_family?: HeadOfFamily;
}
