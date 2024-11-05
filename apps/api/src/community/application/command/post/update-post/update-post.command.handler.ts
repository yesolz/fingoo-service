import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { UpdatePostCommand } from './update-post.command';
import { PostDomain } from '../../../../domain/post.domain';
import { PostMapper } from '../../../../infrastructure/adapter/persistence/mapper/post.mapper';
import { UpdatePostPort } from '../../../port/persistence/post/update-post.port';

@Injectable()
@CommandHandler(UpdatePostCommand)
export class UpdatePostCommandHandler implements ICommandHandler {
  constructor(@Inject('UpdatePostPort') private readonly updatePostPort: UpdatePostPort) {}

  async execute(command: UpdatePostCommand) {
    const { content, postId, userId } = command;
    const postDomain: PostDomain = await this.updatePostPort.updatePost(postId, content, userId);
    return PostMapper.mapDomainToCreateDto(postDomain);
  }
}
