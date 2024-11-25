import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetPostsQuery } from './get-posts.query';
import { GetPostsPort } from '../../../port/persistence/post/get-posts.port';
import { PostMapper } from '../../../../infrastructure/adapter/persistence/mapper/post.mapper';

@Injectable()
@QueryHandler(GetPostsQuery)
export class GetPostsQueryHandler implements IQueryHandler {
  constructor(@Inject('GetPostsPort') private readonly getPostsPort: GetPostsPort) {}

  async execute(query: GetPostsQuery) {
    const { take, cursor } = query;
    const { postDomains, total, hasNextData, nextCursor } = await this.getPostsPort.getPostPageByCursor(take, cursor);
    return PostMapper.mapDomainsToGetPageDto(postDomains, total, hasNextData, nextCursor);
  }
}
