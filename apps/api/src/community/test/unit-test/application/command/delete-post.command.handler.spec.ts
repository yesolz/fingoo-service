import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommunityPersistentAdapter } from '../../../../infrastructure/adapter/persistence/community.persistent.adapter';
import { PostEntity } from '../../../../infrastructure/adapter/persistence/entity/post.entity';
import { mockPostData1 } from '../../../data/mock-post.data1';
import { mockUserMetadataData1 } from '../../../../../user/test/data/mock-user.metadata.data1';
import { mockUserMetadataData2 } from '../../../../../user/test/data/mock-user.metadata.data2';
import { mockPostData2 } from '../../../data/mock-post.data2';
import { DeletePostPort } from '../../../../application/port/persistence/post/delete-post.port';
import { UserMetadataEntity } from '../../../../../user/infrastructure/adapter/persistence/entity/user-metadata.entity';

describe('DeletePost', () => {
  let deletePostPort: DeletePostPort;
  const mockPostRepository = {
    find: jest.fn(),
    findOne: jest.fn().mockImplementation(({ where: { id } }) => {
      if (id === mockPostData1.id) {
        return mockPostData1;
      }
      return null;
    }),
    save: jest.fn(),
    remove: jest.fn().mockImplementation((postEntity: PostEntity) => {
      return postEntity;
    }),
  };
  const mockUserMetadataRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'DeletePostPort',
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
    deletePostPort = await module.resolve<DeletePostPort>('DeletePostPort');
  });

  describe('Persistent', () => {
    it('없는 게시글 가져오기', async () => {
      await expect(deletePostPort.deletePost(mockPostData2.id, mockUserMetadataData1.userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('인가되지 않은 사용자 삭제', async () => {
      await expect(deletePostPort.deletePost(mockPostData1.id, mockUserMetadataData2.userId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('게시글 삭제 완료', async () => {
      expect(await deletePostPort.deletePost(mockPostData1.id, mockUserMetadataData1.userId)).toBe(true);
    });
  });
});
