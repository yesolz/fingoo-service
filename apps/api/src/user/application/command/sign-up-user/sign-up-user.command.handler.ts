import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpUserCommand } from './sign-up-user.command';
import { SignUpPort } from '../../port/external/sign-up.port';
import { SessionDto } from '../../../api/dto/response/session.dto';
import { CreateUserPort } from '../../port/persistence/create-user.port';

@Injectable()
@CommandHandler(SignUpUserCommand)
export class SignUpUserCommandHandler implements ICommandHandler {
  constructor(
    @Inject('SignUpPort')
    private readonly signUpPort: SignUpPort,
    @Inject('CreateUserPort')
    private readonly createUserPort: CreateUserPort,
  ) {}

  async execute(command: SignUpUserCommand): Promise<SessionDto> {
    const { email, password, username } = command;
    const { sessionDto, userId } = await this.signUpPort.signUp(email, password);
    await this.createUserPort.createUser(email, userId, username);
    return sessionDto;
  }
}
