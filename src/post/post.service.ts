import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, authorId: number) {
    const { title, content, published } = createPostDto;

    return await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        published: createPostDto.published,
        author: {
          connect: {
            id: authorId,
          },
        },
        // authorId: authorId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        updatedAt: true,
        createdAt: true,
        authorId: true,
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            address: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.post.findMany({
      where: {
        published: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        updatedAt: true,
        createdAt: true,
        authorId: true,
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            address: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: {
        id: id,
      },
      data: updatePostDto,
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        updatedAt: true,
        createdAt: true,
        authorId: true,
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            address: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}
