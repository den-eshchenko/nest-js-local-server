import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/types/users';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('addUser')
  addUser(@Body() { requestData }: { requestData: User }) {
    return this.usersService.addUser(requestData);
  }
  // @UseGuards(JwtAuthGuard)
  @Get('getAll')
  getAll() {
    return this.usersService.getAllUsers();
  }
  // @UseGuards(JwtAuthGuard)
  @Get('getUser')
  getUser(@Body() { id }: { id: string }) {
    return this.usersService.getUser(id);
  }
}
