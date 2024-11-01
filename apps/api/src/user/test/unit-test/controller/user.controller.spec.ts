import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { SupabaseConnection } from '../../../infrastructure/adapter/supabase/supabase.connection';
import { UserController } from '../../../api/user.controller';
import { SignUpDto } from '../../../api/dto/request/sign-up.dto';
import { SignInDto } from '../../../api/dto/request/sign-in.dto';
import { mockSession1, mockUser1 } from '../../data/mock-user.user1';
import { UpdateUserRequestDto } from '../../../api/dto/request/update-user.request.dto';
import { RefreshTokenRequestDto } from '../../../api/dto/request/refresh-token.request.dto';

const createMockResponse = () => {
  const res: Partial<Response> = {
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    links: jest.fn(),
    sendStatus: jest.fn(),
    jsonp: jest.fn(),
  };
  return res as Response;
};

const mockSupabaseClient = {
  auth: {},
};

jest.mock('../../../infrastructure/adapter/supabase/supabase.connection', () => {
  return {
    SupabaseConnection: jest.fn().mockImplementation(() => {
      return {
        connection: mockSupabaseClient,
      };
    }),
  };
});

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        SupabaseConnection,
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: QueryBus,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('signUp', async () => {
    const signUpDto: SignUpDto = {
      email: mockUser1.email,
      password: 'password123',
      username: 'testuser',
    };

    await expect(userController.signUp(signUpDto, createMockResponse())).resolves.not.toThrow();
  });

  it('signIn', async () => {
    const signInDto: SignInDto = {
      email: mockUser1.email,
      password: 'password123',
    };

    await expect(userController.signIn(signInDto, createMockResponse())).resolves.not.toThrow();
  });

  it('getUser', async () => {
    await expect(userController.getUser(mockUser1)).resolves.not.toThrow();
  });

  it('updateUser', async () => {
    const updateUserRequestDto: UpdateUserRequestDto = { username: 'newUsername' };

    await expect(userController.updateUser(mockUser1, updateUserRequestDto)).resolves.not.toThrow();
  });

  it('deleteUser', async () => {
    await expect(userController.deleteUser(mockUser1, createMockResponse())).resolves.not.toThrow();
  });

  it('refreshToken', async () => {
    const refreshTokenRequestDto: RefreshTokenRequestDto = {
      refreshToken: mockSession1.refresh_token,
    };

    await expect(userController.refreshToken(refreshTokenRequestDto, createMockResponse())).resolves.not.toThrow();
  });
});
