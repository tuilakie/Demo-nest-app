import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { userEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const isUserExist = await this.findOne(null, email);
    if (isUserExist) {
      throw new ForbiddenException(
        `User with this email: ${email} already exists`,
      );
    }
    try {
      const hashedPassword = await bcrypt.hash(
        password,
        +process.env.SALT_ROUNDS,
      );

      const newUser = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
        },
      });
      return newUser;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id?: number, email?: string): Promise<userEntity> {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        // optional chaining
        id: id ?? undefined,
        email: email ?? undefined,
      },
    });
    return foundUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getMe(sub: number) {
    return this.prisma.user.findUnique({
      where: {
        id: sub,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        address: true,
      },
    });
  }
}
