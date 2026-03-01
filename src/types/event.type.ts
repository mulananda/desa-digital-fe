import { EventParticipants } from "./eventParticipant.type";

export interface Event {
  id: string;
  thumbnail: string;
  name: string;
  description: string;
  price: number;
  date: string;
  time: string;
  is_active: boolean;

  event_participants?: EventParticipants[];
  //   // withCount
  event_participants_count?: number;
}
