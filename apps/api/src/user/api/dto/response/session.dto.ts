import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SessionDto {
  @ApiProperty({
    example: '<ACCESS_TOKEN>',
    description: '토큰',
  })
  @IsString()
  access_token: string;

  @ApiProperty({
    example: 'bearer',
    description: '토큰 타입',
  })
  @IsString()
  token_type: string;

  @ApiProperty({
    example: '3600',
    description: '만료 시간',
  })
  @IsString()
  expires_in: string;

  @ApiProperty({
    example: '1700000000',
    description: '만료 시점',
  })
  @IsString()
  expires_at?: string;

  @ApiProperty({
    example: '<REFRESH_TOKEN>',
    description: 'Refresh Token',
  })
  @IsString()
  refresh_token: string;

  constructor(access_token: string, token_type: string, expires_in: string, expires_at: string, refresh_token: string) {
    this.access_token = access_token;
    this.token_type = token_type;
    this.expires_in = expires_in;
    this.expires_at = expires_at;
    this.refresh_token = refresh_token;
  }

  static create(
    access_token: string,
    token_type: string,
    expires_in: string,
    expires_at: string,
    refresh_token: string,
  ): SessionDto {
    return new SessionDto(access_token, token_type, expires_in, expires_at, refresh_token);
  }
}
