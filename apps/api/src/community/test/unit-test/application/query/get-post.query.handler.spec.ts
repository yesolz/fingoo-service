import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommunityPersistentAdapter } from '../../../../infrastructure/adapter/persistence/community.persistent.adapter';
import { PostEntity } from '../../../../infrastructure/adapter/persistence/entity/post.entity';
import { mockPostData1 } from '../../../data/mock-post.data1';
import { mockUserMetadataData1 } from '../../../../../user/test/data/mock-user.metadata.data1';
import { UserMetadataEntity } from '../../../../../user/infrastructure/adapter/persistence/entity/user-metadata.entity';
import { GetPostPort } from '../../../../application/port/persistence/post/get-post.port';
import { PostDomain } from '../../../../domain/post.domain';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('GetPost', () => {
  let getPostPort: GetPostPort;
  const mockPostRepository = {
    find: jest.fn(),
    findOne: jest.fn().mockImplementation(({ where: { id } }) => {
      if (id === mockPostData1.id) {
        return mockPostData1;
      }
      return null;
    }),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const mockUserMetadataRepository = {
    find: jest.fn(),
    findOne: jest.fn().mockImplementation(({ where: { userId } }) => {
      if (userId === mockUserMetadataData1.userId) {
        return mockUserMetadataData1;
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
          provide: 'GetPostPort',
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
    getPostPort = await module.resolve<GetPostPort>('GetPostPort');
  });

  describe('Persistent', () => {
    it('없는 게시글 가져오기', async () => {
      await expect(getPostPort.getPost(999)).rejects.toThrow(NotFoundException);
    });

    it('게시글 정상 조회', async () => {
      const postDomain: PostDomain = await getPostPort.getPost(mockPostData1.id);
      expect(postDomain.id).toEqual(mockPostData1.id);
      expect(postDomain.content).toEqual(mockPostData1.content);
      expect(postDomain.userMetadataDomain.userId).toEqual(mockUserMetadataData1.userId);
      expect(postDomain.userMetadataDomain.email).toEqual(mockUserMetadataData1.email);
      expect(postDomain.userMetadataDomain.id).toEqual(mockUserMetadataData1.id);
      expect(postDomain.userMetadataDomain.username).toEqual(mockUserMetadataData1.username);
    });
  });
});
