import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SignIn, SignUp } from 'src/types/auth';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('check')
  async check(@Req() request: { user: { username: string } }) {
    return { login: request.user.username };
  }

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
