import { UserMetadataEntity } from '../../infrastructure/adapter/persistence/entity/user-metadata.entity';

export const mockUserMetadata4Entity = new UserMetadataEntity();
mockUserMetadata4Entity.id = '44444444-dddd-dddd-dddd-444444444444';
mockUserMetadata4Entity.email = 'test4@email.com';
mockUserMetadata4Entity.userId = '44444444-4444-4444-4444-444444444444';
mockUserMetadata4Entity.username = 'testuser4';
mockUserMetadata4Entity.posts = [];
mockUserMetadata4Entity.createdAt = new Date();
mockUserMetadata4Entity.updatedAt = new Date();
