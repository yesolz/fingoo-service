import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserCommand } from './update-user.command';
import { UpdateUserPort } from '../../port/persistence/update-user.port';
import { UpdateUserResponseDto } from '../../../api/dto/response/update-user.response.dto';
import { UserMetadataDomain } from '../../../domain/user-metadata.domain';
import { UserMetadataMapper } from '../../../infrastructure/adapter/persistence/mapper/user-metadata.mapper';

@Injectable()
@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler {
  constructor(
    @Inject('UpdateUserPort')
    private readonly updateUserPort: UpdateUserPort,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UpdateUserResponseDto> {
    const { userId, username } = command;
    const userMetadataDomain: UserMetadataDomain = await this.updateUserPort.updateUser(userId, username);
    return UserMetadataMapper.mapDomainToUpdateDto(userMetadataDomain);
  }
}
