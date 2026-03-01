import { HeadOfFamily } from "./headOfFamily.type";
import { User } from "./user.type";

export interface EventParticipants {
  event_id: string;
  head_of_family_id: string;
  quantity: string;
  total_price: number;
  payment_status: string;

  head_of_family?: HeadOfFamily;
  user?: User;
}
