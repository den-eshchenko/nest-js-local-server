import { Body, Controller, Post } from '@nestjs/common';
import { SignIn } from 'src/types/auth';
import { User } from 'src/types/users';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('authorization')
  async authorization(@Body() data: SignIn) {
    return this.authService.authorization(data);
  }

  @Post('registration')
  async registration(@Body() user: User) {
    return this.authService.registration(user);
  }

  @Post('refresh-token')
  async refresh(@Body() { refresh_token }: { refresh_token: string }) {
    return this.authService.refresh(refresh_token);
  }
}
