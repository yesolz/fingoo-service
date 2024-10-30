import { UserMetadataMapper } from '../../../../user/infrastructure/adapter/persistence/mapper/user-metadata.mapper';
import { mockUserMetadataData1 } from '../../../../user/test/data/mock-user.metadata.data1';
import { PostMapper } from '../../../infrastructure/adapter/persistence/mapper/post.mapper';
import { mockPostData1 } from '../../data/mock-post.data1';
import { CONTENT_LIMIT_RULE } from '../../../domain/rule/PostContentLengthShouldNotExceedLimit.rule';
import { PostDomain } from '../../../domain/post.domain';
import { LIMITCONTENT } from '../../data/limit.content';

describe('PostDomain', () => {
  const userMetadataDomain = UserMetadataMapper.mapEntityToDomain(mockUserMetadataData1);

  it('should create an instance of PostDomain', () => {
    const postDomain = PostMapper.mapEntityToDomain(mockPostData1, mockUserMetadataData1);

    expect(postDomain).toBeInstanceOf(PostDomain);
    expect(postDomain.id).toBe(mockPostData1.id);
    expect(postDomain.userMetadataDomain).toStrictEqual(userMetadataDomain);
    expect(postDomain.content).toBe(mockPostData1.content);
    expect(postDomain.viewCount).toBe(mockPostData1.viewCount);
    expect(postDomain.createdAt).toBeInstanceOf(Date);
    expect(postDomain.updatedAt).toBeInstanceOf(Date);
  });

  it('should throw an error if content exceeds length limit on creation', () => {
    expect(() => {
      PostDomain.create(1, userMetadataDomain, LIMITCONTENT, 0, new Date(), new Date());
    }).toThrow(`글자수는 최대 ${CONTENT_LIMIT_RULE} 자를 넘길 수 없습니다`);
  });

  it('should update content', () => {
    const postDomain: PostDomain = PostDomain.create(
      1,
      userMetadataDomain,
      'Initial content',
      0,
      new Date(),
      new Date(),
    );

    postDomain.updateContent('Updated content');

    expect(postDomain.content).toBe('Updated content');
  });

  it('should throw an error if new content exceeds length limit on update', () => {
    const postDomain: PostDomain = PostDomain.create(
      1,
      userMetadataDomain,
      'Initial content',
      0,
      new Date(),
      new Date(),
    );

    expect(() => {
      postDomain.updateContent(LIMITCONTENT);
    }).toThrow(`글자수는 최대 ${CONTENT_LIMIT_RULE} 자를 넘길 수 없습니다`);
  });
});
