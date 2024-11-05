import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdatePostPort } from '../../../../application/port/persistence/post/update-post.port';
import { CommunityPersistentAdapter } from '../../../../infrastructure/adapter/persistence/community.persistent.adapter';
import { PostEntity } from '../../../../infrastructure/adapter/persistence/entity/post.entity';
import { mockPostData1 } from '../../../data/mock-post.data1';
import { mockUserMetadataData1 } from '../../../../../user/test/data/mock-user.metadata.data1';
import { mockUserMetadataData2 } from '../../../../../user/test/data/mock-user.metadata.data2';
import { LIMITCONTENT } from '../../../data/limit.content';
import { PostDomain } from '../../../../domain/post.domain';
import { mockPostData2 } from '../../../data/mock-post.data2';
import { UserMetadataEntity } from '../../../../../user/infrastructure/adapter/persistence/entity/user-metadata.entity';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

const UPDATE_CONTENT: string = 'new content for test';

describe('UpdatePost', () => {
  let updatePostPort: UpdatePostPort;
  const mockPostRepository = {
    find: jest.fn(),
    findOne: jest.fn().mockImplementation(({ where: { id } }) => {
      if (id === mockPostData1.id) {
        return mockPostData1;
      }
      return null;
    }),
    save: jest.fn().mockImplementation((postEntity: PostEntity) => {
      return postEntity;
    }),
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
          provide: 'UpdatePostPort',
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
    updatePostPort = await module.resolve<UpdatePostPort>('UpdatePostPort');
  });

  describe('Persistent', () => {
    it('없는 게시글 가져오기', async () => {
      await expect(
        updatePostPort.updatePost(mockPostData2, UPDATE_CONTENT, mockUserMetadataData2.userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('인가되지 않은 사용자 수정 신청', async () => {
      await expect(
        updatePostPort.updatePost(mockPostData1.id, UPDATE_CONTENT, mockUserMetadataData2.userId),
      ).rejects.toThrow(ForbiddenException);
    });

    it('게시글 비즈니스 룰 위반', async () => {
      await expect(
        updatePostPort.updatePost(mockPostData1.id, LIMITCONTENT, mockUserMetadataData1.userId),
      ).rejects.toThrow(BadRequestException);
    });

    it('게시글 수정 완료', async () => {
      const postDomain: PostDomain = await updatePostPort.updatePost(
        mockPostData1.id,
        UPDATE_CONTENT,
        mockUserMetadataData1.userId,
      );
      expect(postDomain.id).toEqual(mockPostData1.id);
      expect(postDomain.content).toEqual(mockPostData1.content);
      expect(postDomain.userMetadataDomain.userId).toEqual(mockUserMetadataData1.userId);
      expect(postDomain.userMetadataDomain.email).toEqual(mockUserMetadataData1.email);
      expect(postDomain.userMetadataDomain.id).toEqual(mockUserMetadataData1.id);
      expect(postDomain.userMetadataDomain.username).toEqual(mockUserMetadataData1.username);
    });
  });
});
