import { Body, Controller, Post } from '@nestjs/common';
import { SignIn, SignUp } from 'src/types/auth';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('authorization')
  async authorization(@Body() data: SignIn) {
    return this.authService.authorization(data);
  }

  @Post('registration')
  async registration(@Body() data: SignUp) {
    return this.authService.registration(data);
  }

  @Post('refresh-token')
  async refresh(@Body() { refresh_token }: { refresh_token: string }) {
    return this.authService.refresh(refresh_token);
  }
}
