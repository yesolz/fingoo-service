import { mockPostData1 } from '../../data/mock-post.data1';
import { mockUserMetadataData1 } from '../../../../user/test/data/mock-user.metadata.data1';
import { PostDomain } from '../../../domain/post.domain';
import { PostMapper } from '../../../infrastructure/adapter/persistence/mapper/post.mapper';
import { UserMetadataDomain } from '../../../../user/domain/user-metadata.domain';
import { CreatePostResponseDto } from '../../../api/dto/response/create-post.response.dto';
import { UpdatePostResponseDto } from '../../../api/dto/response/update-post.response.dto';
import { GetPostsResponseDto } from '../../../api/dto/response/get-posts.response.dto';
import { GetPostReponseDto } from '../../../api/dto/response/get-post.reponse.dto';
import { mockPostData2 } from '../../data/mock-post.data2';

describe('PostMapper', () => {
  const userMetadataEntity = mockUserMetadataData1;
  const userMetadataDomain = new UserMetadataDomain(
    userMetadataEntity.id,
    userMetadataEntity.userId,
    userMetadataEntity.email,
    userMetadataEntity.username,
  );
  const postEntity0 = mockPostData1;
  const postEntity1 = mockPostData2;
  const postDomain0 = new PostDomain(
    postEntity0.id,
    userMetadataDomain,
    postEntity0.content,
    postEntity0.viewCount,
    postEntity0.createdAt,
    postEntity0.updatedAt,
  );
  const postDomain1 = new PostDomain(
    postEntity1.id,
    userMetadataDomain,
    postEntity1.content,
    postEntity1.viewCount,
    postEntity1.createdAt,
    postEntity1.updatedAt,
  );

  const postDomains: PostDomain[] = [postDomain0, postDomain1];

  test('mapDomainToCreateDto should map PostDomain to CreatePostResponseDto', () => {
    const result: CreatePostResponseDto = PostMapper.mapDomainToCreateDto(postDomain0);
    expect(result.postId).toBe(postDomain0.id.toString());
    expect(result.content).toBe(postDomain0.content);
    expect(result.author).toBe(postDomain0.userMetadataDomain.username);
    expect(result.createdAt).toBe(postDomain0.createdAt.toString());
    expect(result.updatedAt).toBe(postDomain0.updatedAt.toString());
  });

  test('mapDomainToUpdateDto should map PostDomain to UpdatePostResponseDto', () => {
    const result: UpdatePostResponseDto = PostMapper.mapDomainToUpdateDto(postDomain0);
    expect(result.postId).toBe(postDomain0.id.toString());
    expect(result.content).toBe(postDomain0.content);
    expect(result.author).toBe(postDomain0.userMetadataDomain.username);
    expect(result.createdAt).toBe(postDomain0.createdAt.toString());
    expect(result.updatedAt).toBe(postDomain0.updatedAt.toString());
  });

  test('mapEntityToDomain should map PostEntity and UserMetadataEntity to PostDomain', () => {
    const result: PostDomain = PostMapper.mapEntityToDomain(postEntity0, userMetadataEntity);
    expect(result.id).toBe(postEntity0.id);
    expect(result.userMetadataDomain).toStrictEqual(userMetadataDomain);
    expect(result.content).toBe(postEntity0.content);
    expect(result.viewCount).toBe(postEntity0.viewCount);
    expect(result.createdAt).toBe(postEntity0.createdAt);
    expect(result.updatedAt).toBe(postEntity0.updatedAt);
  });

  test('mapDomainsToGetPageDto should map PostDomainList and CursorMetadata to GetPostsResponseDto', () => {
    const result: GetPostsResponseDto<GetPostReponseDto> = PostMapper.mapDomainsToGetPageDto(
      postDomains,
      postDomains.length,
      false,
      null,
    );
    expect(result.data[0].postId).toBe(postEntity0.id.toString());
    expect(result.data[1].postId).toBe(postEntity1.id.toString());
    expect(result.meta.total).toBe(2);
    expect(result.meta.hasNextData).toBeFalsy();
    expect(result.meta.nestCursor).toBeNull();
  });
});
