import { SessionDto } from '../../../api/dto/response/session.dto';

export interface RefreshTokenPort {
  getRefreshToken(refreshToken: string): Promise<SessionDto>;
}
