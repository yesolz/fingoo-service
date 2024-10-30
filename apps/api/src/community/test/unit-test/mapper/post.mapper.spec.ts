import { mockPostData1 } from '../../data/mock-post.data1';
import { mockUserMetadataData1 } from '../../../../user/test/data/mock-user.metadata.data1';
import { PostDomain } from '../../../domain/post.domain';
import { PostMapper } from '../../../infrastructure/adapter/persistence/mapper/post.mapper';
import { UserMetadataDomain } from '../../../../user/domain/user-metadata.domain';
import { CreatePostResponseDto } from '../../../api/dto/response/create-post.response.dto';
import { UpdatePostResponseDto } from '../../../api/dto/response/update-post.response.dto';
import { UserMetadataMapper } from '../../../../user/infrastructure/adapter/persistence/mapper/user-metadata.mapper';

describe('PostMapper', () => {
  const postEntity = mockPostData1;
  const userMetadataEntity = mockUserMetadataData1;
  const userMetadataDomain = new UserMetadataDomain(
    userMetadataEntity.id,
    userMetadataEntity.userId,
    userMetadataEntity.email,
    userMetadataEntity.username,
  );
  const postDomain = new PostDomain(
    postEntity.id,
    userMetadataDomain,
    postEntity.content,
    postEntity.viewCount,
    postEntity.createdAt,
    postEntity.updatedAt,
  );

  test('mapDomainToCreateDto should map PostDomain to CreatePostResponseDto', () => {
    const result: CreatePostResponseDto = PostMapper.mapDomainToCreateDto(postDomain);
    expect(result.postId).toBe(postDomain.id.toString());
    expect(result.content).toBe(postDomain.content);
    expect(result.author).toBe(postDomain.userMetadataDomain.username);
    expect(result.createdAt).toBe(postDomain.createdAt.toString());
    expect(result.updatedAt).toBe(postDomain.updatedAt.toString());
  });

  test('mapDomainToUpdateDto should map PostDomain to UpdatePostResponseDto', () => {
    const result: UpdatePostResponseDto = PostMapper.mapDomainToUpdateDto(postDomain);
    expect(result.postId).toBe(postDomain.id.toString());
    expect(result.content).toBe(postDomain.content);
    expect(result.author).toBe(postDomain.userMetadataDomain.username);
    expect(result.createdAt).toBe(postDomain.createdAt.toString());
    expect(result.updatedAt).toBe(postDomain.updatedAt.toString());
  });

  test('mapEntityToDomain should map PostEntity and UserMetadataEntity to PostDomain', () => {
    jest.spyOn(UserMetadataMapper, 'mapEntityToDomain').mockReturnValue(userMetadataDomain);

    const result: PostDomain = PostMapper.mapEntityToDomain(postEntity, userMetadataEntity);
    expect(result.id).toBe(postEntity.id);
    expect(result.userMetadataDomain).toBe(userMetadataDomain);
    expect(result.content).toBe(postEntity.content);
    expect(result.viewCount).toBe(postEntity.viewCount);
    expect(result.createdAt).toBe(postEntity.createdAt);
    expect(result.updatedAt).toBe(postEntity.updatedAt);
  });
});
