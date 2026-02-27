// src/types/development.type.ts
import type { DevelopmentApplicant } from "./developmentApplicant.type";

export type DevelopmentStatus = "ongoing" | "completed";

export interface Development {
  id: string;
  thumbnail: string;
  name: string;
  person_in_charge: string;
  description: string;
  start_date: string; // tidak optional — wajib ada dari backend
  end_date: string; // tidak optional — wajib ada dari backend
  amount: number;
  status: DevelopmentStatus;
  development_applicants?: DevelopmentApplicant[];
  development_applicants_count?: number;
}
