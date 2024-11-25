import { ApiProperty } from '@nestjs/swagger';

export class CursorPageMetadataDto {
  @ApiProperty({
    example: 10,
    description: '조회된 총 게시글 수',
  })
  readonly total: number;

  @ApiProperty({
    example: true,
    description: '다음 데이터 유무',
  })
  readonly hasNextData: boolean;

  @ApiProperty({
    example: 123,
    description: '다음 커서 정보(게시글의 index)',
  })
  readonly nestCursor: number;

  constructor(total, hasNextData, nestCursor) {
    this.total = total;
    this.hasNextData = hasNextData;
    this.nestCursor = nestCursor;
  }
}
