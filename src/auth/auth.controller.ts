import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/types/users';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('authorization')
  async authorization(@Body() user: User) {
    return this.authService.authorization(user);
  }

  @Post('registration')
  async registration(@Body() user: User) {
    return this.authService.registration(user);
  }

  // @UseGuards(AuthGuard)
  @Post('refresh-token')
  async refresh(@Body() { refresh_token }: { refresh_token: string }) {
    return this.authService.refresh(refresh_token);
  }
}
