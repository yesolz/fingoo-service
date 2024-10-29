import { UserMetadataDomain } from '../../../domain/user-metadata.domain';

export interface UpdateUserPort {
  updateUser(userId: string, username: string): Promise<UserMetadataDomain>;
}
