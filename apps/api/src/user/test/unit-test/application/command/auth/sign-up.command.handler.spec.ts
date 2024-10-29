import { SupabaseConnection } from '../../../../../infrastructure/adapter/supabase/supabase.connection';
import { mockSession1, mockUser1 } from '../../../../data/mock-user.user1';
import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseAdapter } from '../../../../../infrastructure/adapter/supabase/supabase.adapter';
import { SignUpPort } from '../../../../../application/port/external/sign-up.port';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserMetadataEntity } from '../../../../../infrastructure/adapter/persistence/entity/user-metadata.entity';
import { CreateUserPort } from '../../../../../application/port/persistence/create-user.port';
import { UserPersistentAdapter } from '../../../../../infrastructure/adapter/persistence/user.persistent.adapter';
import { mockUser2 } from '../../../../data/mock-user.user2';

const VALID_TOKEN = '<ACCESS_TOKEN>';

const PASSWORD = 'password';
const USERNAME = 'testuser';

const mockSupabaseClient = {
  auth: {
    signUp: jest.fn(({ email }) => {
      if (mockUser1.email === email) {
        return Promise.resolve({ data: { user: null, session: null }, error: 'User already exists.' });
      }
      return Promise.resolve({ data: { user: mockUser1, session: mockSession1 }, error: null });
    }),
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

describe('SignUp', () => {
  let signUpPort: SignUpPort;
  let createUserPort: CreateUserPort;
  const mockUserMetadataRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn().mockImplementation(({ userId, email, username }) => {
      if (userId === mockUser1.id || email === mockUser1.email) {
        throw new BadRequestException();
      }
      return { userId, email, username };
    }),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseConnection,
        SupabaseAdapter,
        {
          provide: 'SignUpPort',
          useClass: SupabaseAdapter,
        },
        {
          provide: 'CreateUserPort',
          useClass: UserPersistentAdapter,
        },
        {
          provide: getRepositoryToken(UserMetadataEntity),
          useValue: mockUserMetadataRepository,
        },
      ],
    }).compile();
    createUserPort = await module.resolve<CreateUserPort>('CreateUserPort');
    signUpPort = await module.resolve<SignUpPort>('SignUpPort');
  });

  describe('Supabase', () => {
    it('기존에 있는 정보를 사용한 회원가입', async () => {
      await expect(signUpPort.signUp(mockUser1.email, PASSWORD)).rejects.toThrow(BadRequestException);
    });

    it('새로운 사용자 회원가입', async () => {
      const { sessionDto } = await signUpPort.signUp(mockUser2.email, 'newPassword');
      expect(sessionDto.access_token).toBeDefined();
      expect(sessionDto.access_token).toEqual(VALID_TOKEN);
    });
  });

  describe('Persistent', () => {
    it('기존에 있는 정보를 사용한 회원가입', async () => {
      await expect(createUserPort.createUser(mockUser1.email, mockUser1.id, USERNAME)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('새로운 사용자 회원가입', async () => {
      const userMetadataEntity: UserMetadataEntity = await createUserPort.createUser(
        mockUser2.email,
        mockUser2.id,
        'newUser',
      );
      expect(userMetadataEntity.userId).toEqual(mockUser2.id);
      expect(userMetadataEntity.email).toEqual(mockUser2.email);
      expect(userMetadataEntity.username).toEqual('newUser');
    });
  });
});
