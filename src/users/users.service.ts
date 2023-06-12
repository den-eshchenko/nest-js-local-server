import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { SignUp } from 'src/types/auth';
import { User } from 'src/types/users';
import { WsException } from '@nestjs/websockets';
import { TMessage, TRooms } from 'src/types/events';
@Injectable()
export class UsersService {
  private readonly users: User[] = [];
  private readonly rooms: TRooms = {};

  addUser(data: SignUp) {
    const id = uuidv4();

    this.users.push({
      ...data,
      id,
      friends: [],
    });
  }

  getAllUsers() {
    return this.users;
  }

  getUserById(id: string) {
    const foundUser = this.users.find((user) => user.id === id);

    if (!foundUser) {
      throw new HttpException(
        'Пользователь не найден!',
        HttpStatus.BAD_REQUEST,
      );
    }

    return foundUser;
  }

  getUserByName(login: string) {
    const foundUser = this.users.find((user) => user.login === login);

    if (!foundUser) {
      throw new HttpException(
        'Пользователь не найден!',
        HttpStatus.BAD_REQUEST,
      );
    }

    return foundUser;
  }

  addFriend(userId: string, friendId: string) {
    const currentUser = this.users.find((user) => user.id === userId);
    const foundFriend = this.users.find((user) => user.id === friendId);

    if (currentUser && foundFriend) {
      currentUser.friends.push(friendId);
    }

    if (!currentUser || !foundFriend) {
      throw new HttpException(
        `Пользователь c id ${currentUser?.id || foundFriend?.id} не найден!`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  addRoom(userLogin: string, roomName: string) {
    const foundUser = this.users.find((user) => user.login === userLogin);
    const isFoundRoom = Object.keys(this.rooms).includes?.(roomName);

    if (!foundUser) {
      throw new WsException({ message: 'Такой пользователь не найден!' });
    }

    const joinMessage = {
      email: foundUser.email,
      message: 'is joined to channel',
      userLogin,
      isJoin: true,
    };

    if (isFoundRoom) {
      this.rooms[roomName] = {
        ...this.rooms[roomName],
        users: [...this.rooms[roomName].users, userLogin],
        messages: [...this.rooms[roomName].messages, joinMessage],
      };

      return joinMessage;
    }

    this.rooms[roomName] = {
      messages: [],
      users: [userLogin],
      roomCreator: userLogin,
    };

    return;
  }

  addMessage({
    message,
    roomName,
    userLogin,
  }: {
    userLogin: string;
    roomName: string;
    message: TMessage;
  }) {
    const foundUser = this.users.find((user) => user.login === userLogin);
    const isFoundRoom = Object.keys(this.rooms).includes?.(roomName);

    if (!foundUser) {
      throw new WsException({ message: 'Такой пользователь не найден!' });
    }

    if (!isFoundRoom) {
      throw new WsException({ message: 'У вас такой комнаты нет!' });
    }

    this.rooms[roomName].messages = [...this.rooms[roomName].messages, message];
  }

  getRooms(userLogin: string) {
    const roomNames = Object.keys(this.rooms).filter((roomName) =>
      this.rooms[roomName].users.includes(userLogin),
    );
    const rooms = roomNames.reduce<TRooms>((acc, roomName) => {
      const roomData = this.rooms[roomName];
      const filteredMessages = roomData.messages.filter(
        (message) => !(message.isJoin && message.userLogin === userLogin),
      );
      acc[roomName] = {
        ...roomData,
        messages: filteredMessages,
      };

      return acc;
    }, {});

    return rooms;
  }
}
