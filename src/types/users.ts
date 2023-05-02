import { TRooms } from './events';

export type User = {
  id: string;
  login: string;
  fullName: string;
  email: string;
  password: string;
  friends?: string[];
  rooms?: TRooms;
};
