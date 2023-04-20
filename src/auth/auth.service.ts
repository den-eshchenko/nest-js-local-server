import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/types/users';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async authorization(user: User) {
    const isRegistered = !!this.usersService.getUser(user.id);

    if (isRegistered) {
      const jwtPayload = { username: user.name };
      const [at, rt] = await Promise.all([
        this.jwtService.signAsync(jwtPayload, {
          secret: process.env.JWT_ACCESS_KEY,
          expiresIn: '1m',
        }),
        this.jwtService.signAsync(jwtPayload, {
          secret: process.env.JWT_REFRESH_KEY,
          expiresIn: '2m',
        }),
      ]);

      return {
        access_token: at,
        refresh_token: rt,
      };
    }

    throw new UnauthorizedException();
  }

  async registration(user: User) {
    if (user.name && user.email) {
      this.usersService.addUser(user);

      return new HttpException(
        'Вы успешно зарегистрированы!',
        HttpStatus.CREATED,
      );
    }

    throw new HttpException(
      'Должны быть указаны имя и почта!',
      HttpStatus.BAD_REQUEST,
    );
  }

  async refresh(refresh_token: string) {
    try {
      const jwtPayload = await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.JWT_REFRESH_KEY,
      });
      return {
        access_token: this.jwtService.sign(jwtPayload),
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
