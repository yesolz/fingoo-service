import { IQuery } from '@nestjs/cqrs';

export class GetPostQuery implements IQuery {
  constructor(readonly postId: string) {}
}
