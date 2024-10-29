import { UserMetadataEntity } from '../../infrastructure/adapter/persistence/entity/user-metadata.entity';

export const mockUserMetadata3Entity = new UserMetadataEntity();
mockUserMetadata3Entity.id = '33333333-cccc-cccc-cccc-333333333333';
mockUserMetadata3Entity.email = 'test3@email.com';
mockUserMetadata3Entity.userId = '33333333-3333-3333-3333-333333333333';
mockUserMetadata3Entity.username = 'testuser3';
mockUserMetadata3Entity.posts = [];
mockUserMetadata3Entity.createdAt = new Date();
mockUserMetadata3Entity.updatedAt = new Date();
