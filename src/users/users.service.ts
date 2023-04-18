import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/types/users';

@Injectable()
export class UsersService {
  users: User[] = [];

  addUser(user: User) {
    this.users.push(user);
  }
  getAllUsers() {
    return this.users;
  }
  getUser(id: string) {
    return this.users.find((user) => user.id === id);
  }
  addFriend(userId: string, friendId: string) {
    const currentUser = this.users.find((user) => user.id === userId);

    if (currentUser) {
      currentUser.friends.push(friendId);
    }

    if (!currentUser) {
      throw new HttpException(
        'Пользователь не найденЙ!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
