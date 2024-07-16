import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignIn, SignUp } from 'src/types/auth';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async authorization(data: SignIn) {
    const foundUser = this.usersService.getUserByName(data.login);

    if (foundUser) {
      const jwtPayload = { username: data.login };
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
        login: foundUser.login,
      };
    }

    throw new UnauthorizedException();
  }

  async registration(data: SignUp) {
    if (!data.login || !data.email) {
      return new HttpException(
        'Должны быть указаны имя и почта!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const users = this.usersService.getAllUsers();
    const foundUser = users.find((user) => user.login === data.login);

    if (foundUser) {
      throw new HttpException(
        'Имя должно быть уникальным!',
        HttpStatus.CONFLICT,
      );
    }

    this.usersService.addUser(data);

    return new HttpException(
      'Вы успешно зарегистрированы!',
      HttpStatus.CREATED,
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
