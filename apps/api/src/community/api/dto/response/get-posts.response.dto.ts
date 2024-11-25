import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CursorPageMetadataDto } from './cursor-page-metadata.dto';

export class GetPostsResponseDto<T> {
  @ApiProperty({
    example: '2024-10-02',
    description: '수정 날짜',
  })
  @IsArray()
  readonly data: T[];

  @ApiProperty({
    example: new CursorPageMetadataDto(10, true, 123),
    description: '커서 메타데이터',
  })
  readonly meta: CursorPageMetadataDto;

  constructor(data: T[], meta: CursorPageMetadataDto) {
    this.data = data;
    this.meta = meta;
  }
}
