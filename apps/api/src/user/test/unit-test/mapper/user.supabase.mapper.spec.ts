import { UserMetadataDomain } from '../../../domain/user-metadata.domain';
import { UserMetadataEntity } from '../../../infrastructure/adapter/persistence/entity/user-metadata.entity';
import { UserMetadataMapper } from '../../../infrastructure/adapter/persistence/mapper/user-metadata.mapper';
import { GetUserResponseDto } from '../../../api/dto/response/get-user.response.dto';
import { UpdateUserResponseDto } from '../../../api/dto/response/update-user.response.dto';

describe('UserMetadataMapper', () => {
  const mockUserMetadataDomain: UserMetadataDomain = UserMetadataDomain.create(
    '1',
    'user-uuid',
    'test@example.com',
    'testuser',
  );

  const mockUserMetadataEntity = new UserMetadataEntity();
  mockUserMetadataEntity.id = '1';
  mockUserMetadataEntity.username = 'testuser';
  mockUserMetadataEntity.userId = 'user-uuid';
  mockUserMetadataEntity.email = 'test@example.com';
  mockUserMetadataEntity.updatedAt = new Date();
  mockUserMetadataEntity.createdAt = new Date();

  it('should map domain to GetUserResponseDto', () => {
    const result = UserMetadataMapper.mapDomainToGetDto(mockUserMetadataDomain);

    expect(result).toBeInstanceOf(GetUserResponseDto);
    expect(result.email).toBe(mockUserMetadataDomain.email);
    expect(result.username).toBe(mockUserMetadataDomain.username);
  });

  it('should map domain to UpdateUserResponseDto', () => {
    const result = UserMetadataMapper.mapDomainToUpdateDto(mockUserMetadataDomain);

    expect(result).toBeInstanceOf(UpdateUserResponseDto);
    expect(result.email).toBe(mockUserMetadataDomain.email);
    expect(result.username).toBe(mockUserMetadataDomain.username);
  });

  it('should map UserMetadataEntity to UserMetadataDomain', () => {
    const result = UserMetadataMapper.mapEntityToDomain(mockUserMetadataEntity);

    expect(result).toBeInstanceOf(UserMetadataDomain);
    expect(result.id).toBe(mockUserMetadataEntity.id);
    expect(result.userId).toBe(mockUserMetadataEntity.userId);
    expect(result.email).toBe(mockUserMetadataEntity.email);
    expect(result.username).toBe(mockUserMetadataEntity.username);
  });
});
