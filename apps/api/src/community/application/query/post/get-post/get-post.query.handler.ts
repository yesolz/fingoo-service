import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { GetPostQuery } from './get-post.query';
import { GetPostPort } from '../../../port/persistence/post/get-post.port';
import { PostMapper } from '../../../../infrastructure/adapter/persistence/mapper/post.mapper';
import { PostDomain } from '../../../../domain/post.domain';

@Injectable()
@QueryHandler(GetPostQuery)
export class GetPostQueryHandler implements IQueryHandler {
  constructor(
    @Inject('GetPostPort')
    private readonly getPostPort: GetPostPort,
  ) {}

  async execute(query: GetPostQuery) {
    const { postId } = query;
    const postDomain: PostDomain = await this.getPostPort.getPost(postId);
    return PostMapper.mapDomainToGetDto(postDomain);
  }
}
