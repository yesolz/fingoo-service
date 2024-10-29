import { SupabaseConnection } from '../../../../../infrastructure/adapter/supabase/supabase.connection';
import { mockUser1 } from '../../../../data/mock-user.user1';
import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseAdapter } from '../../../../../infrastructure/adapter/supabase/supabase.adapter';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserMetadataEntity } from '../../../../../infrastructure/adapter/persistence/entity/user-metadata.entity';
import { DeleteUserPort } from '../../../../../application/port/persistence/delete-user.port';
import { UserPersistentAdapter } from '../../../../../infrastructure/adapter/persistence/user.persistent.adapter';
import { AccountDeletionPort } from '../../../../../application/port/external/account-deletion.port';
import { mockUser2 } from '../../../../data/mock-user.user2';

const USERID = mockUser1.id;
const NONE_USER_ID = mockUser2.id;
const USERNAME = 'testUser';

const mockSupabaseClient = {
  auth: {
    admin: {
      deleteUser: jest.fn().mockImplementation((userId) => {
        if (userId === USERID) {
          return true;
        }
        throw new BadRequestException();
      }),
    },
  },
};

jest.mock('../../../../../infrastructure/adapter/supabase/supabase.connection', () => {
  return {
    SupabaseConnection: jest.fn().mockImplementation(() => {
      return {
        connection: mockSupabaseClient,
      };
    }),
  };
});

describe('DeleteUser', () => {
  let deleteUserPort: DeleteUserPort;
  let accountDeletionPort: AccountDeletionPort;
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
    remove: jest.fn().mockImplementation((userMetadataEntity: UserMetadataEntity) => {
      if (userMetadataEntity.userId !== USERID) {
        throw new BadRequestException();
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseConnection,
        SupabaseAdapter,
        {
          provide: 'AccountDeletionPort',
          useClass: SupabaseAdapter,
        },
        {
          provide: 'DeleteUserPort',
          useClass: UserPersistentAdapter,
        },
        {
          provide: getRepositoryToken(UserMetadataEntity),
          useValue: mockUserMetadataRepository,
        },
      ],
    }).compile();
    accountDeletionPort = await module.resolve<AccountDeletionPort>('AccountDeletionPort');
    deleteUserPort = await module.resolve<DeleteUserPort>('DeleteUserPort');
  });

  describe('Supabase', () => {
    it('기존에 있는 정보를 사용한 사용자 삭제', async () => {
      const result = await accountDeletionPort.deleteUser(USERID);
      expect(result).toBe(true);
    });

    it('기존에 없는 정보를 사용한 사용자 삭제', async () => {
      await expect(accountDeletionPort.deleteUser(NONE_USER_ID)).rejects.toThrow(BadRequestException);
    });
  });

  describe('Persistent', () => {
    it('기존에 있는 정보를 사용한 사용자 삭제', async () => {
      const result = await deleteUserPort.deleteUser(USERID);
      expect(result).toBe(true);
    });

    it('기존에 없는 정보를 사용한 사용자 삭제', async () => {
      await expect(deleteUserPort.deleteUser(NONE_USER_ID)).rejects.toThrow(BadRequestException);
    });
  });
});
