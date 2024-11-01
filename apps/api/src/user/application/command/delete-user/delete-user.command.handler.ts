import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { DeleteUserCommand } from './delete-user.command';
import { DeleteUserPort } from '../../port/persistence/delete-user.port';
import { AccountDeletionPort } from '../../port/external/account-deletion.port';

@Injectable()
@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler implements ICommandHandler {
  constructor(
    @Inject('DeleteUserPort')
    private readonly deleteUserPort: DeleteUserPort,
    @Inject('AccountDeletionPort')
    private readonly accountDeletionPort: AccountDeletionPort,
  ) {}

  async execute(command: DeleteUserCommand): Promise<boolean> {
    const { userId } = command;
    await this.accountDeletionPort.deleteUser(userId);
    return this.deleteUserPort.deleteUser(userId);
  }
}
