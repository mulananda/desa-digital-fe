// src/types/socialAssistance.type.ts
import { SocialAssistanceRecipient } from "./socialAssistanceRecipient.type";

export interface SocialAssistance {
  id: string;
  thumbnail: string;
  name: string;
  category: string;
  amount: number;
  provider: string;
  description?: string;
  is_available: boolean;

  social_assistance_recipients?: SocialAssistanceRecipient[];
  // withCount
  social_assistance_recipients_count?: number;
}

export interface CreateSocialAssistancePayload {
  thumbnail: string;
  name: string;
  category: string;
  amount: number;
  provider: string;
  description?: string;
  is_available: boolean;
}
