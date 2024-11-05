import { CreatePostPort } from '../../../../application/port/persistence/post/create-post.port';
import { Test, TestingModule } from '@nestjs/testing';
import { CommunityPersistentAdapter } from '../../../../infrastructure/adapter/persistence/community.persistent.adapter';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostEntity } from '../../../../infrastructure/adapter/persistence/entity/post.entity';
import { UserMetadataEntity } from '../../../../../user/infrastructure/adapter/persistence/entity/user-metadata.entity';
import { BadRequestException } from '@nestjs/common';
import { PostDomain } from '../../../../domain/post.domain';
import { UserMetadataMapper } from '../../../../../user/infrastructure/adapter/persistence/mapper/user-metadata.mapper';
import { LIMITCONTENT } from '../../../data/limit.content';
import { mockUserMetadataData1 } from '../../../../../user/test/data/mock-user.metadata.data1';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('CreatePost', () => {
  let createPostPort: CreatePostPort;

  const mockPostRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn().mockImplementation((postEntity: PostEntity) => {
      return postEntity;
    }),
    remove: jest.fn(),
  };

  const mockUserMetadataRepository = {
    find: jest.fn(),
    findOne: jest.fn().mockImplementation(({ where: { userId } }) => {
      if (userId === mockUserMetadataData1.userId) {
        return mockUserMetadataData1;
      }
      throw new BadRequestException();
    }),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'CreatePostPort',
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
    createPostPort = await module.resolve<CreatePostPort>('CreatePostPort');
  });

  it('CreatePost', async () => {
    const postDomain: PostDomain = await createPostPort.createPost('test content', mockUserMetadataData1.userId);
    const userMetadataDomain = UserMetadataMapper.mapEntityToDomain(mockUserMetadataData1);
    expect(postDomain.content).toEqual('test content');
    expect(postDomain.userMetadataDomain).toStrictEqual(userMetadataDomain);
  });

  it('CreatePost-exception limit content size', async () => {
    await expect(createPostPort.createPost(LIMITCONTENT, mockUserMetadataData1.userId)).rejects.toThrow(
      BadRequestException,
    );
  });
});
