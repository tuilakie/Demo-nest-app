import { Optional, Options } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @Optional()
  content?: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @Optional()
  published?: boolean = this.published || false;
}
