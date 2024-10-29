import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { SignInUserQuery } from './sign-in-user.query';
import { SignInPort } from '../../port/external/sign-in.port';
import { SessionDto } from '../../../api/dto/response/session.dto';

@Injectable()
@QueryHandler(SignInUserQuery)
export class SignInUserQueryHandler implements IQueryHandler {
  private readonly logger = new Logger(SignInUserQueryHandler.name);
  constructor(
    @Inject('SignInPort')
    private readonly signInPort: SignInPort,
  ) {}

  async execute(query: SignInUserQuery): Promise<SessionDto> {
    const { email, password } = query;
    return this.signInPort.signIn(email, password);
  }
}
