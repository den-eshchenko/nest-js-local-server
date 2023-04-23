import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignIn } from 'src/types/auth';
import { User } from 'src/types/users';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async authorization(data: SignIn) {
    const isRegistered = !!this.usersService.getUserByName(data.username);

    if (isRegistered) {
      const jwtPayload = { username: data.username };
      const [access_token, refresh_token] = await Promise.all([
        this.jwtService.signAsync(jwtPayload, {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
        }),
        this.jwtService.signAsync(jwtPayload, {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
        }),
      ]);

      return {
        access_token,
        refresh_token,
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
        secret: process.env.JWT_SECRET_KEY,
      });
      const access_token = this.jwtService.sign(jwtPayload, {
        secret: process.env.JWT_SECRET_KEY,
      });

      return {
        access_token,
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
