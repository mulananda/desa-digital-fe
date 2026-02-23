import { HeadOfFamily } from "./headOfFamily.type";
import { User } from "./user.type";

export interface DevelopmentApplicant {
  /* ================= ID ================= */
  id: string;

  thumbnail: string;
  name: string;
  description: string;
  person_in_charge: string;
  start_date: string;
  end_date: string;
  created_at: string;

  amount: number;
  status: Status;
  /* ================= RELATION ================= */

  user?: User;
  head_of_family?: HeadOfFamily;
}

export type Status = "pending" | "approved" | "rejected";
