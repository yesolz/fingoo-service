import { UserMetadataDomain } from '../../../domain/user-metadata.domain';

const id = '1';
const userId = 'user-1';
const email = 'test@example.com';
const username = 'testuser';

describe('UserMetadataDomain', () => {
  let userMetadataDomain: UserMetadataDomain;

  it('should create UserMetadataDomain with valid data', () => {
    userMetadataDomain = UserMetadataDomain.create(id, userId, email, username);

    expect(userMetadataDomain).toBeInstanceOf(UserMetadataDomain);
    expect(userMetadataDomain.id).toBe(id);
    expect(userMetadataDomain.userId).toBe(userId);
    expect(userMetadataDomain.email).toBe(email);
    expect(userMetadataDomain.username).toBe(username);
  });

  it('should throw an error if username is invalid', () => {
    const nullUsername = '';
    expect(() => {
      userMetadataDomain = UserMetadataDomain.create(id, userId, email, nullUsername);
    }).toThrowError();
  });

  it('should not throw an error if username is valid', () => {
    const validUsername = 'validUser';
    expect(() => {
      userMetadataDomain = UserMetadataDomain.create(id, userId, email, validUsername);
    }).not.toThrow();
  });
});
