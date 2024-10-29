import { UserMetadataEntity } from '../../../infrastructure/adapter/persistence/entity/user-metadata.entity';
import { PostEntity } from '../../../../community/infrastructure/adapter/persistence/entity/post.entity';

describe('UserMetadataEntity', () => {
  let userMetadata: UserMetadataEntity;

  beforeEach(() => {
    userMetadata = new UserMetadataEntity();
  });

  it('should create an instance of UserMetadataEntity', () => {
    expect(userMetadata).toBeInstanceOf(UserMetadataEntity);
  });

  it('should set and get id correctly', () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';
    userMetadata.id = id;
    expect(userMetadata.id).toBe(id);
  });

  it('should set and get userId correctly', () => {
    const userId = 'user-1';
    userMetadata.userId = userId;
    expect(userMetadata.userId).toBe(userId);
  });

  it('should set and get email correctly', () => {
    const email = 'test@example.com';
    userMetadata.email = email;
    expect(userMetadata.email).toBe(email);
  });

  it('should set and get username correctly', () => {
    const username = 'testuser';
    userMetadata.username = username;
    expect(userMetadata.username).toBe(username);
  });

  it('should set and get posts correctly', () => {
    const posts: PostEntity[] = [];
    userMetadata.posts = posts;
    expect(userMetadata.posts).toEqual(posts);
  });

  it('should set and get createdAt correctly', () => {
    const createdAt = new Date();
    userMetadata.createdAt = createdAt;
    expect(userMetadata.createdAt).toBe(createdAt);
  });

  it('should set and get updatedAt correctly', () => {
    const updatedAt = new Date();
    userMetadata.updatedAt = updatedAt;
    expect(userMetadata.updatedAt).toBe(updatedAt);
  });
});
