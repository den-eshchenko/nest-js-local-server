export type TRoom = {
  users: { socketId: string; login: string }[];
  messages: string[];
};

export type TRooms = Record<string, TRoom>;
