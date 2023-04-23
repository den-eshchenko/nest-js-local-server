import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/types/users';
@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  addUser(user: User) {
    this.users.push(user);
  }

  getAllUsers() {
    return this.users;
  }

  getUser(id: string) {
    const foundUser = this.users.find((user) => user.id === id);

    if (!foundUser) {
      throw new HttpException(
        'Пользователь не найден!',
        HttpStatus.BAD_REQUEST,
      );
    }

    return foundUser;
  }

  getUserByName(name: string) {
    const foundUser = this.users.find((user) => user.name === name);

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
}
