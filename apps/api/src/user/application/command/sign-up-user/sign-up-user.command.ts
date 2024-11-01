import { ICommand } from '@nestjs/cqrs';

export class SignUpUserCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly username: string,
  ) {}
}
