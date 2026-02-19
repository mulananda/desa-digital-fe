// src/types/development.type.ts
export interface Development {
  id: string;
  thumbnail: string;
  name: string;
  description: string;
  person_in_charge: string;
  start_date?: string;
  end_date?: string;
  amount?: number;
  status?: string;
  development_applicants_count?: number;
}

export interface CreateDevelopmentPayload {
  thumbnail: string;
  name: string;
  description: string;
  person_in_charge: string;
  start_date?: string;
  end_date?: string;
  amount?: number;
  status?: string;
}
