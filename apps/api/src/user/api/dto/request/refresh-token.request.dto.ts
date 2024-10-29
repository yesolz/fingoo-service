import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenRequestDto {
  @ApiProperty({
    example: '<REFRESH_TOKEN>',
    description: '인증 토큰 재발급용 토큰',
  })
  @IsString()
  refreshToken: string;
}
