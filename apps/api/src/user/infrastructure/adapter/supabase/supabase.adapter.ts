import { BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SignInPort } from '../../../application/port/external/sign-in.port';
import { SignUpPort } from '../../../application/port/external/sign-up.port';
import { AccountDeletionPort } from '../../../application/port/external/account-deletion.port';
import { RefreshTokenPort } from '../../../application/port/external/refresh-token.port';
import { SupabaseConnection } from './supabase.connection';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { SessionDto } from '../../../api/dto/response/session.dto';

@Injectable()
export class SupabaseAdapter
  extends PassportStrategy(Strategy)
  implements SignInPort, SignUpPort, RefreshTokenPort, AccountDeletionPort
{
  private readonly logger = new Logger(SupabaseAdapter.name);

  constructor(private readonly supabaseConnection: SupabaseConnection) {
    super({ usernameField: 'email' });
  }

  async getRefreshToken(refreshToken: string): Promise<SessionDto> {
    try {
      const { data, error } = await this.supabaseConnection.connection.auth.refreshSession({
        refresh_token: refreshToken,
      });
      if (error) {
        throw new BadRequestException(`올바르지 않은 refreshToken: ${error.message}`);
      }
      return SessionDto.create(
        data.session.access_token,
        data.session.token_type,
        data.session.expires_in.toString(),
        data.session.expires_at.toString(),
        data.session.refresh_token,
      );
    } catch (error) {
      throw new BadRequestException({
        HttpStatus: HttpStatus.NOT_FOUND,
        error: `[ERROR] RefreshToken 발급 중 오류가 발생했습니다.`,
        message: 'RefreshToken 발급 중 오류가 발생했습니다.',
        cause: error,
      });
    }
  }

  async signUp(email: string, password: string): Promise<{ sessionDto: SessionDto; userId: string }> {
    try {
      const { data, error } = await this.supabaseConnection.connection.auth.signUp({
        email: email,
        password: password,
      });
      if (error) {
        throw new BadRequestException(`회원가입에 실패했습니다: ${error.message}`);
      }
      const userId: string = data.user.id;
      const sessionDto: SessionDto = SessionDto.create(
        data.session.access_token,
        data.session.token_type,
        data.session.expires_in.toString(),
        data.session.expires_at.toString(),
        data.session.refresh_token,
      );
      return { sessionDto, userId };
    } catch (error) {
      throw new BadRequestException({
        HttpStatus: HttpStatus.NOT_FOUND,
        error: `[ERROR] 회원가입 중 오류가 발생했습니다.`,
        message: '회원가입 중 오류가 발생했습니다.',
        cause: error,
      });
    }
  }

  async signIn(email, password): Promise<SessionDto> {
    try {
      const { data, error } = await this.supabaseConnection.connection.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        throw new BadRequestException('로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.');
      }
      return SessionDto.create(
        data.session.access_token,
        data.session.token_type,
        data.session.expires_in.toString(),
        data.session.expires_at.toString(),
        data.session.refresh_token,
      );
    } catch (error) {
      throw new BadRequestException({
        HttpStatus: HttpStatus.NOT_FOUND,
        error: `[ERROR] 로그인 중 오류가 발생했습니다.`,
        message: '로그인 중 오류가 발생했습니다.',
        cause: error,
      });
    }
  }

  async validate(username: string, password: string): Promise<SessionDto> {
    // Passport의 local Strategy가 사용함
    // local-auth.guard.ts에서 자동으로 사용
    return this.signIn(username, password);
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const { error } = await this.supabaseConnection.connection.auth.admin.deleteUser(userId);
      if (error) {
        throw new BadRequestException('사용자가 존재하지 않습니다.');
      }
      return true;
    } catch (error) {
      throw new BadRequestException({
        HttpStatus: HttpStatus.NOT_FOUND,
        error: `[ERROR] 사용자가 존재하지 않습니다.`,
        message: '사용자가 존재하지 않습니다.',
        cause: error,
      });
    }
  }
}
