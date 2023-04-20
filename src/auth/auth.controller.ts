import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/types/users';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(AuthGuard('pass'))
  @Post('authorization')
  async authorization(@Body() user: User) {
    console.log('authorizationReq ', user);
    return this.authService.authorization(user);
  }

  @Post('registration')
  async registration(@Body() user: User) {
    return this.authService.registration(user);
  }

  // @Post('refresh-accessToken')
  // async refresh(@Body() body: RefreshToken) {
  //   console.log('refresh-accessTokenReq ', body);
  //   return this.authService.refresh(body.refresh_token);
  // }
}
