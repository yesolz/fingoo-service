import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserMetadataEntity } from '../../../../../infrastructure/adapter/persistence/entity/user-metadata.entity';
import { UserPersistentAdapter } from '../../../../../infrastructure/adapter/persistence/user.persistent.adapter';
import { mockUser1 } from '../../../../data/mock-user.user1';
import { mockUser2 } from '../../../../data/mock-user.user2';
import { UserMetadataDomain } from '../../../../../domain/user-metadata.domain';
import { GetUserPort } from '../../../../../application/port/persistence/get-user.port';

const USERID = mockUser1.id;
const NONE_USER_ID = mockUser2.id;
const USERNAME = 'testUser';

describe('GetUser', () => {
  let getUserPort: GetUserPort;
  const mockUserMetadataRepository = {
    find: jest.fn(),
    findOne: jest.fn().mockImplementation(({ where: { userId } }) => {
      if (userId === USERID) {
        return {
          userId: USERID,
          email: mockUser1.email,
          username: USERNAME,
        };
      }
      throw new BadRequestException();
    }),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'GetUserPort',
          useClass: UserPersistentAdapter,
        },
        {
          provide: getRepositoryToken(UserMetadataEntity),
          useValue: mockUserMetadataRepository,
        },
      ],
    }).compile();
    getUserPort = await module.resolve<GetUserPort>('GetUserPort');
  });

  describe('Persistent', () => {
    it('기존에 있는 정보를 사용한 사용자 조회', async () => {
      const userMetadataDomain: UserMetadataDomain = await getUserPort.getUser(USERID);
      expect(userMetadataDomain.email).toEqual(mockUser1.email);
      expect(userMetadataDomain.userId).toEqual(mockUser1.id);
      expect(userMetadataDomain.username).toEqual(USERNAME);
    });

    it('기존에 없는 정보를 사용한 사용자 조회', async () => {
      await expect(getUserPort.getUser(NONE_USER_ID)).rejects.toThrow(BadRequestException);
    });
  });
});
