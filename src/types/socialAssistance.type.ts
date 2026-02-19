// src/types/socialAssistance.type.ts
export interface SocialAssistance {
  id: string;
  thumbnail?: string;
  name: string;
  category: string;
  amount: number;
  provider: string;
  description?: string;
  is_available: boolean;
  // withCount
  social_assistance_recipients_count?: number;
}
