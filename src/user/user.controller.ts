import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { userEntity } from './entities/user.entity';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: userEntity })
  @Get('me')
  async getMe(@Req() req: any): Promise<Omit<userEntity, 'password'>> {
    const { sub } = req.user;
    return this.userService.getMe(sub);
  }
}
