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
  getRoomData(@Param() { userLogin }: { userLogin: string }) {
    return this.usersService.getRooms(userLogin);
  }
}
