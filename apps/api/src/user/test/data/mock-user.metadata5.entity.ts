import { UserMetadataEntity } from '../../infrastructure/adapter/persistence/entity/user-metadata.entity';

export const mockUserMetadata5Entity = new UserMetadataEntity();
mockUserMetadata5Entity.id = '55555555-eeee-eeee-eeee-555555555555';
mockUserMetadata5Entity.email = 'test5@email.com';
mockUserMetadata5Entity.userId = '55555555-5555-5555-5555-555555555555';
mockUserMetadata5Entity.username = 'testuser5';
mockUserMetadata5Entity.createdAt = new Date();
mockUserMetadata5Entity.updatedAt = new Date();
