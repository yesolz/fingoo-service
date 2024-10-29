import { UserMetadataEntity } from '../../../infrastructure/adapter/persistence/entity/user-metadata.entity';

export interface CreateUserPort {
  createUser(email: string, userId: string, username: string): Promise<UserMetadataEntity>;
}
