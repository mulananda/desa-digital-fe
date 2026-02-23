// src/types/socialAssistance.type.ts
import { SocialAssistanceRecipient } from "./socialAssistanceRecipient.type";

export type SocialAssistanceCategory =
  | "staple"
  | "cash"
  | "subsidized fuel"
  | "health";

export interface SocialAssistance {
  id: string;
  thumbnail: string;
  name: string;
  category: SocialAssistanceCategory;
  amount: number;
  provider: string;
  description: string;
  is_available: boolean;

  social_assistance_recipients?: SocialAssistanceRecipient[];
  // withCount
  social_assistance_recipients_count?: number;
}
