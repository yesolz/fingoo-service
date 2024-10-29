import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RefreshTokenPort } from '../../port/external/refresh-token.port';
import { RefreshTokenQuery } from './refresh-token.query';
import { SessionDto } from '../../../api/dto/response/session.dto';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
@QueryHandler(RefreshTokenQuery)
export class RefreshTokenQueryHandler implements IQueryHandler {
  private readonly logger = new Logger(RefreshTokenQueryHandler.name);

  constructor(
    @Inject('RefreshTokenPort')
    private readonly refreshTokenPort: RefreshTokenPort,
  ) {}

  async execute(query: RefreshTokenQuery): Promise<SessionDto> {
    const { refreshToken } = query;
    return this.refreshTokenPort.getRefreshToken(refreshToken);
  }
}
