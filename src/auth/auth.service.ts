import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './../user/dto/create-user.dto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(authDto: AuthDto): Promise<AuthEntity> {
    try {
      const { email, password } = authDto;
      const user = await this.userService.findOne(null, email);
      if (!user) {
        throw new NotFoundException(`No user found for email: ${email}`);
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      const { accessToken, refeshToken } = await this.signJwtToken(
        user.id,
        user.email,
      );

      this.userService.update(user.id, { refeshToken });

      return { accessToken, refeshToken };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async register(createUserDto: CreateUserDto): Promise<AuthEntity> {
    try {
      const user = await this.userService.create(createUserDto);
      const { accessToken, refeshToken } = await this.signJwtToken(
        user.id,
        user.email,
      );

      await this.userService.update(user.id, { refeshToken });

      return { accessToken, refeshToken };
    } catch (error) {
      return error;
    }
  }

  async signJwtToken(UserId: number, email: string): Promise<AuthEntity> {
    const payload = {
      sub: UserId,
      email,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_EXPIRES_IN_ACCESS,
        secret: process.env.JWT_SECRETKEY_ACCESS,
      }),
      refeshToken: await this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_EXPIRES_IN_REFRESH,
        secret: process.env.JWT_SECRETKEY_REFRESH,
      }),
    };
  }
}
