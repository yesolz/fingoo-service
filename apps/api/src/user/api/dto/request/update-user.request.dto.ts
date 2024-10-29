import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserRequestDto {
  @ApiProperty({
    example: 'user1',
    description: '사용자이름',
  })
  @IsString()
  username: string;
}
