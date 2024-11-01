import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from './create-post.command';
import { Inject, Injectable } from '@nestjs/common';
import { PostDomain } from 'src/community/domain/post.domain';
import { CreatePostPort } from '../../../port/persistence/post/create-post.port';
import { PostMapper } from '../../../../infrastructure/adapter/persistence/mapper/post.mapper';

@Injectable()
@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler implements ICommandHandler {
  constructor(@Inject('CreatePostPort') private readonly createPostPort: CreatePostPort) {}

  async execute(command: CreatePostCommand) {
    const { content, userId } = command;
    const postDomain: PostDomain = await this.createPostPort.createPost(content, userId);
    return PostMapper.mapDomainToCreateDto(postDomain);
  }
}
