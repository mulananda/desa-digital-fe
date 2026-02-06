// src/types/headOfFamily.type.ts

import { User } from "./user.type";

export interface HeadOfFamily {
  id: string;
  identity_number: string;
  occupation?: string;
  profile_picture?: string;
  family_members_count?: number;
  user?: User;
}
