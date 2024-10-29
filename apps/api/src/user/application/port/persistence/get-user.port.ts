import { UserMetadataDomain } from '../../../domain/user-metadata.domain';

export interface GetUserPort {
  getUser(userId: string): Promise<UserMetadataDomain>;
}
