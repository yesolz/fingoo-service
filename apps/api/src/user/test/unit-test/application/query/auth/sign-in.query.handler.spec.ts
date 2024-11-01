import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../../util/jwt-auth.guard';
import { SupabaseConnection } from '../../../../../infrastructure/adapter/supabase/supabase.connection';
import { mockUser1, mockSession1 } from '../../../../data/mock-user.user1';
import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseAdapter } from '../../../../../infrastructure/adapter/supabase/supabase.adapter';
import { SignInPort } from '../../../../../application/port/external/sign-in.port';
import { SessionDto } from '../../../../../api/dto/response/session.dto';
import { mockSession2 } from '../../../../data/mock-user.user2';

const VALID_TOKEN = mockSession1.access_token;
const INVALID_TOKEN = mockSession2.access_token;

const EMAIL = mockUser1.email;
const PASSWORD = 'password';

const mockSupabaseClient = {
  auth: {
    getUser: jest.fn((token: string) => {
      if (token === VALID_TOKEN) {
        return Promise.resolve({ data: { user: mockUser1, session: mockSession1 }, error: null });
      } else if (token === INVALID_TOKEN) {
        return Promise.resolve({ data: { user: null, session: null }, error: 'Invalid token' });
      } else {
        return Promise.resolve({ data: { user: null, session: null }, error: 'No token provided' });
      }
    }),
    signInWithPassword: jest.fn(({ email, password }) => {
      if (EMAIL === email && PASSWORD === password) {
        return Promise.resolve({ data: { user: mockUser1, session: mockSession1 }, error: null });
      } else {
        return Promise.resolve({ data: { user: null, session: null }, error: 'There is no user' });
      }
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

describe('SignIn', () => {
  let guard: JwtAuthGuard;
  let signInPort: SignInPort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        SupabaseConnection,
        SupabaseAdapter,
        JwtAuthGuard,
        {
          provide: 'SignInPort',
          useClass: SupabaseAdapter,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    signInPort = await module.resolve<SignInPort>('SignInPort');
  });

  it('회원가입 하지 않은 사용자 로그인', async () => {
    await expect(signInPort.signIn('newUser@example.com', 'newPassword')).rejects.toThrow(BadRequestException);
  });

  it('Email, Password를 사용한 로그인', async () => {
    const session: SessionDto = await signInPort.signIn(EMAIL, PASSWORD);
    expect(session.access_token).toBeDefined();
    expect(session.access_token).toEqual(VALID_TOKEN);
  });

  it('만약 token이 없다면 로그인 실패', async () => {
    const context: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => ({
          headers: {},
        }),
      }),
      getHandler: jest.fn().mockReturnValue(() => {}),
      getClass: jest.fn().mockReturnValue(class {}),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('만약 token이 유효하지 않다면 로그인 실패', async () => {
    const context: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => ({
          headers: {
            authorization: `mockBearer ${INVALID_TOKEN}`,
          },
        }),
      }),
      getHandler: jest.fn().mockReturnValue(() => {}),
      getClass: jest.fn().mockReturnValue(class {}),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('만약 token이 유효하다면 로그인 가능', async () => {
    const context: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => ({
          headers: {
            authorization: `Bearer ${VALID_TOKEN}`,
          },
        }),
      }),
      getHandler: jest.fn().mockReturnValue(() => {}),
      getClass: jest.fn().mockReturnValue(class {}),
    } as unknown as ExecutionContext;

    expect(await guard.canActivate(context)).toBe(true);
  });
});
