import { UserMetadataEntity } from '../../infrastructure/adapter/persistence/entity/user-metadata.entity';

export const mockUserMetadata2Entity = new UserMetadataEntity();
mockUserMetadata2Entity.id = '22222222-bbbb-bbbb-bbbb-222222222222';
mockUserMetadata2Entity.email = 'test2@email.com';
mockUserMetadata2Entity.userId = '22222222-2222-2222-2222-222222222222';
mockUserMetadata2Entity.username = 'testuser2';
mockUserMetadata2Entity.createdAt = new Date();
mockUserMetadata2Entity.updatedAt = new Date();
