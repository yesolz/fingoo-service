import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommunityPersistentAdapter } from '../../../../infrastructure/adapter/persistence/community.persistent.adapter';
import { PostEntity } from '../../../../infrastructure/adapter/persistence/entity/post.entity';
import { mockPostData1 } from '../../../data/mock-post.data1';
import { mockUserMetadataData1 } from '../../../../../user/test/data/mock-user.metadata.data1';
import { mockUserMetadataData2 } from '../../../../../user/test/data/mock-user.metadata.data2';
import { mockPostData2 } from '../../../data/mock-post.data2';
import { UserMetadataEntity } from '../../../../../user/infrastructure/adapter/persistence/entity/user-metadata.entity';
import { GetPostsPort } from '../../../../application/port/persistence/post/get-posts.port';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('GetPosts', () => {
  const userMetadataEntity0 = mockUserMetadataData1;
  const userMetadataEntity1 = mockUserMetadataData2;
  const postEntity0 = mockPostData1;
  const postEntity1 = mockPostData2;
  const postEntities: PostEntity[] = [postEntity0, postEntity1];

  let getPostsPort: GetPostsPort;
  const mockPostRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    findAndCount: jest.fn().mockImplementation(({ take, where }) => {
      let filteredPosts = postEntities;
      if (where.id && where.id.value) {
        filteredPosts = filteredPosts.filter((post) => post.id < where.id.value);
      }

      const reversedPostEntities = filteredPosts.reverse();
      const slicePostEntities = reversedPostEntities.slice(0, take);

      return [slicePostEntities, postEntities.length];
    }),
  };
  const mockUserMetadataRepository = {
    find: jest.fn(),
    findOne: jest.fn().mockImplementation(({ where: { id } }) => {
      if (id === userMetadataEntity0.userId) {
        return userMetadataEntity0;
      }
      if (id === userMetadataEntity1.userId) {
        return userMetadataEntity1;
      }
      return null;
    }),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'GetPostsPort',
          useClass: CommunityPersistentAdapter,
        },
        {
          provide: getRepositoryToken(PostEntity),
          useValue: mockPostRepository,
        },
        {
          provide: getRepositoryToken(UserMetadataEntity),
          useValue: mockUserMetadataRepository,
        },
      ],
    }).compile();
    getPostsPort = await module.resolve<GetPostsPort>('GetPostsPort');
  });

  describe('Persistent', () => {
    it('post index에 없는 cursor 값 입력', async () => {
      await expect(getPostsPort.getPostPageByCursor(2, -1)).rejects.toThrow(NotFoundException);
    });

    it('처음으로 list를 조회할 때 - cursor = null', async () => {
      const result = await getPostsPort.getPostPageByCursor(2, null);
      expect(result.postDomains.length).toBe(2);
      expect(result.total).toBe(2);
      expect(result.hasNextData).toBe(true);
      expect(result.nextCursor).toBe(1);
    });

    it('일반적인 경우 - take 수가 total보다 클 때', async () => {
      const result = await getPostsPort.getPostPageByCursor(10, null);
      expect(result.postDomains.length).toBe(2);
      expect(result.total).toBe(2);
      expect(result.hasNextData).toBe(false);
      expect(result.nextCursor).toBe(null);
    });

    it('일반적인 경우 - take 수가 total보다 작을 때', async () => {
      const result = await getPostsPort.getPostPageByCursor(1, 2);
      expect(result.postDomains.length).toBe(1);
      expect(result.total).toBe(2);
      expect(result.hasNextData).toBe(false);
      expect(result.nextCursor).toBeNull();
    });
  });
});
