import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/types/users';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Post('addUser')
  addUser(@Body() user: User) {
    return this.usersService.addUser(user);
  }

  @UseGuards(AuthGuard)
  @Post('addFriend')
  addFriend(
    @Body() { userId, friendId }: { userId: string; friendId: string },
  ) {
    return this.usersService.addFriend(userId, friendId);
  }

  @UseGuards(AuthGuard)
  @Get('getAll')
  getAll() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(AuthGuard)
  @Get('getUser')
  getUser(@Body() { id }: { id: string }) {
    return this.usersService.getUser(id);
  }
}
