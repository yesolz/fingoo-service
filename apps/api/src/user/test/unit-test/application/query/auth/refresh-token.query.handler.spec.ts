import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseConnection } from '../../../../../infrastructure/adapter/supabase/supabase.connection';
import { mockSession1, mockUser1 } from '../../../../data/mock-user.user1';
import { SupabaseAdapter } from '../../../../../infrastructure/adapter/supabase/supabase.adapter';
import { mockSession2 } from '../../../../data/mock-user.user2';
import { RefreshTokenPort } from '../../../../../application/port/external/refresh-token.port';
import { SessionDto } from '../../../../../api/dto/response/session.dto';

const mockSupabaseClient = {
  auth: {
    refreshSession: jest.fn().mockImplementation(({ refresh_token }) => {
      if (refresh_token === mockSession1.refresh_token) {
        return Promise.resolve({ data: { user: mockUser1, session: mockSession1 }, error: null });
      } else if (refresh_token === mockSession2.refresh_token) {
        return Promise.resolve({ data: { user: null, session: null }, error: 'Invalid token' });
      } else {
        return Promise.resolve({ data: { user: null, session: null }, error: 'No token provided' });
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

describe('RefreshToken', () => {
  let refreshTokenPort: RefreshTokenPort;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        SupabaseConnection,
        SupabaseAdapter,
        {
          provide: 'RefreshTokenPort',
          useClass: SupabaseAdapter,
        },
      ],
    }).compile();
    refreshTokenPort = await module.resolve<RefreshTokenPort>('RefreshTokenPort');
  });

  it('만약 token이 없다면 세션 획득 실패', async () => {
    await expect(refreshTokenPort.getRefreshToken(null)).rejects.toThrow(BadRequestException);
  });

  it('만약 token이 유효하지 않다면 세션 획득 실패', async () => {
    await expect(refreshTokenPort.getRefreshToken(mockSession2.refresh_token)).rejects.toThrow(BadRequestException);
  });

  it('만약 token이 유효하다면 세션 획득 성공', async () => {
    const sessionDto: SessionDto = await refreshTokenPort.getRefreshToken(mockSession1.refresh_token);
    expect(sessionDto.access_token).toEqual(mockSession1.access_token);
    expect(sessionDto.refresh_token).toEqual(mockSession1.refresh_token);
  });
});
