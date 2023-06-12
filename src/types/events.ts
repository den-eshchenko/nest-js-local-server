export type TMessage = {
  userLogin: string;
  message: string;
  email: string;
  isJoin?: boolean;
};

export type TRoom = {
  users: string[];
  messages: TMessage[];
  roomCreator: string;
};

export type TRooms = Record<string, TRoom>;
