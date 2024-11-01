import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserMetadataEntity } from '../../../../../infrastructure/adapter/persistence/entity/user-metadata.entity';
import { UserPersistentAdapter } from '../../../../../infrastructure/adapter/persistence/user.persistent.adapter';
import { mockUser1 } from '../../../../data/mock-user.user1';
import { mockUser2 } from '../../../../data/mock-user.user2';
import { UpdateUserPort } from '../../../../../application/port/persistence/update-user.port';
import { UserMetadataDomain } from '../../../../../domain/user-metadata.domain';

const USERID = mockUser1.id;
const NONE_USER_ID = mockUser2.id;
const USERNAME = 'testUser';

describe('UpdateUser', () => {
  let updateUserPort: UpdateUserPort;
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
    save: jest.fn().mockImplementation(({ userId }) => {
      if (userId === USERID) {
        return {
          userId: USERID,
          email: mockUser1.email,
          username: USERNAME,
        };
      }
      throw new BadRequestException();
    }),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'UpdateUserPort',
          useClass: UserPersistentAdapter,
        },
        {
          provide: getRepositoryToken(UserMetadataEntity),
          useValue: mockUserMetadataRepository,
        },
      ],
    }).compile();
    updateUserPort = await module.resolve<UpdateUserPort>('UpdateUserPort');
  });

  describe('Persistent', () => {
    it('기존에 있는 정보를 사용한 사용자 수정', async () => {
      const userMetadataDomain: UserMetadataDomain = await updateUserPort.updateUser(USERID, USERNAME);
      expect(userMetadataDomain.email).toEqual(mockUser1.email);
      expect(userMetadataDomain.userId).toEqual(mockUser1.id);
      expect(userMetadataDomain.username).toEqual(USERNAME);
    });

    it('기존에 없는 정보를 사용한 사용자 수정', async () => {
      await expect(updateUserPort.updateUser(NONE_USER_ID, USERNAME)).rejects.toThrow(BadRequestException);
    });
  });
});
