import { ICommand } from '@nestjs/cqrs';

export class CreatePostCommand implements ICommand {
  constructor(
    readonly content: string,
    readonly userId: string,
  ) {}
}
