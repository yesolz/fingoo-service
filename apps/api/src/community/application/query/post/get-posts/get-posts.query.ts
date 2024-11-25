import { IQuery } from '@nestjs/cqrs';

export class GetPostsQuery implements IQuery {
  constructor(
    readonly take: number,
    readonly cursor: number,
  ) {}
}
