import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { SignUp } from 'src/types/auth';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Post('addUser')
  addUser(@Body() data: SignUp) {
    return this.usersService.addUser(data);
  }

  @UseGuards(AuthGuard)
  @Post('addFriend')
  addFriend(
    @Body() { userId, friendId }: { userId: string; friendId: string },
  ) {
    return this.usersService.addFriend(userId, friendId);
  }

  // @UseGuards(AuthGuard)
  @Get('getAll')
  getAll() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(AuthGuard)
  @Get('getUserById')
  getUser(@Body() { id }: { id: string }) {
    return this.usersService.getUserById(id);
  }

  @Get('rooms/:userLogin')
  getRooms(@Param() { userLogin }: { userLogin: string }) {
    return this.usersService.getAllRooms(userLogin);
  }

  @Get('rooms/:userLogin/:roomName')
  getRoomData(
    @Param() { userLogin, roomName }: { userLogin: string; roomName: string },
  ) {
    return this.usersService.getRoomData(userLogin, roomName);
  }
}
