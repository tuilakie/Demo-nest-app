import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@prisma/client';
import { userEntity } from '../../user/entities/user.entity';

export class PostEntity implements Post {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  authorId: number | null;

  @ApiProperty()
  author?: Omit<userEntity, 'password'>;
}
