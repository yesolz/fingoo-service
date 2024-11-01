import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserResponseDto {
  @ApiProperty({
    example: 'test@gmail.com',
    description: '이메일',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'user1',
    description: '사용자이름',
  })
  @IsString()
  username: string;

  constructor(email: string, username: string) {
    this.email = email;
    this.username = username;
  }
}
