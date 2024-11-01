import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'test@gmail.com',
    description: '이메일',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'password123@',
    description: '비밀번호',
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'user1',
    description: '사용자이름',
  })
  @IsString()
  username: string;
}
