import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetUserQuery } from './get-user.query';
import { GetUserPort } from '../../port/persistence/get-user.port';
import { GetUserResponseDto } from '../../../api/dto/response/get-user.response.dto';
import { UserMetadataDomain } from '../../../domain/user-metadata.domain';
import { UserMetadataMapper } from '../../../infrastructure/adapter/persistence/mapper/user-metadata.mapper';

@Injectable()
@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler {
  private readonly logger = new Logger(GetUserQueryHandler.name);

  constructor(
    @Inject('GetUserPort')
    private readonly getUserPort: GetUserPort,
  ) {}

  async execute(query: GetUserQuery): Promise<GetUserResponseDto> {
    const { userId } = query;
    const userMetadataDomain: UserMetadataDomain = await this.getUserPort.getUser(userId);
    return UserMetadataMapper.mapDomainToGetDto(userMetadataDomain);
  }
}
