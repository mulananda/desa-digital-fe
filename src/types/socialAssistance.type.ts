// src/types/socialAssistance.type.ts
export interface SocialAssistance {
  id: string;
  name: string;
  provider: string;
  amount: number;
  description?: string;
  thumbnail?: string;
  // withCount
  social_assistance_recipients_count?: number;
}
