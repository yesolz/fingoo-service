import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetPostsRequestDto {
  @ApiProperty({
    example: '10',
    description: '게시글 리스트 조회 개수(Default: 10)',
  })
  @Type(() => Number)
  @IsOptional()
  readonly take?: number = 10;

  @ApiProperty({
    example: '10',
    description: '커서 정보(게시글 index), null이면 처음 조회하는 것',
  })
  @Type(() => Number)
  readonly cursorId?: number = null;
}
