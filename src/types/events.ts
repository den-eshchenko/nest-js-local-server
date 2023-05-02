export type TMessage = {
  form: string;
  message: string;
  email: string;
};

export type TRoom = {
  users: string[];
  messages: TMessage[];
};

export type TRooms = Record<string, TRoom>;
