import { HeadOfFamily } from "./headOfFamily.type";

// src/types/user.type.ts
export interface User {
  id: string;
  name: string;
  email?: string;

  head_of_family: HeadOfFamily;
}
