import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { SignUp } from 'src/types/auth';
import { User } from 'src/types/users';
import { WsException } from '@nestjs/websockets';
import { TMessage } from 'src/types/events';
@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  addUser(data: SignUp) {
    const id = uuidv4();
    const friends = [];

    this.users.push({ ...data, id, friends });
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
    const isFoundRoom = Object.keys(foundUser?.rooms || {}).includes?.(
      roomName,
    );

    if (!foundUser) {
      throw new WsException({ message: 'Такой пользователь не найден!' });
    }

    if (isFoundRoom) {
      throw new WsException({ message: 'У вас уже есть такая комната!' });
    }

    foundUser.rooms[roomName] = { messages: [], users: [] };
    return new HttpException(`Комната добавлена`, HttpStatus.CREATED);
  }

  addMessage(userLogin: string, roomName: string, message: TMessage) {
    const foundUser = this.users.find((user) => user.login === userLogin);
    const isFoundRoom = Object.keys(foundUser?.rooms || {}).includes?.(
      roomName,
    );

    if (!foundUser) {
      throw new WsException({ message: 'Такой пользователь не найден!' });
    }

    if (!isFoundRoom) {
      throw new WsException({ message: 'У вас такой комнаты нет!' });
    }

    foundUser.rooms[roomName].messages = [
      ...foundUser.rooms[roomName].messages,
      message,
    ];
    return new HttpException(`Комната добавлена`, HttpStatus.CREATED);
  }

  getAllRooms(userLogin: string) {
    const rooms =
      this.users.find((user) => user.login === userLogin)?.rooms || [];

    return rooms;
  }

  getRoomData(userLogin: string, roomName: string) {
    const currentUser = this.getUserByName(userLogin);
    const roomMessages = currentUser.rooms?.[roomName] || {
      messages: [],
      users: [],
    };

    return roomMessages;
  }
}
