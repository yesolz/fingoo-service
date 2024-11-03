import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { DeletePostCommand } from './delete-post.command';
import { DeletePostPort } from '../../../port/persistence/post/delete-post.port';

@Injectable()
@CommandHandler(DeletePostCommand)
export class DeletePostCommandHandler implements ICommandHandler {
  constructor(@Inject('DeletePostPort') private readonly deletePostPort: DeletePostPort) {}

  async execute(command: DeletePostCommand): Promise<boolean> {
    const { postId, userId } = command;
    return this.deletePostPort.deletePost(postId, userId);
  }
}
