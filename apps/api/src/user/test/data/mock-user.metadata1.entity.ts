import { UserMetadataEntity } from '../../infrastructure/adapter/persistence/entity/user-metadata.entity';

export const mockUserMetadata1Entity = new UserMetadataEntity();
mockUserMetadata1Entity.id = '11111111-aaaa-aaaa-aaaa-111111111111';
mockUserMetadata1Entity.email = 'test1@email.com';
mockUserMetadata1Entity.userId = '11111111-1111-1111-1111-111111111111';
mockUserMetadata1Entity.username = 'testuser1';
mockUserMetadata1Entity.posts = [];
mockUserMetadata1Entity.createdAt = new Date();
mockUserMetadata1Entity.updatedAt = new Date();
