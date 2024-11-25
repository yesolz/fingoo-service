import { ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { SupabaseConnection } from '../infrastructure/adapter/supabase/supabase.connection';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private reflector: Reflector = new Reflector();
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    @Inject(SupabaseConnection)
    private readonly supabaseConnection: SupabaseConnection,
  ) {
    super();

    if (!this.supabaseConnection) {
      this.logger.error('SupabaseConnection이 주입되지 않았습니다.');
      throw new UnauthorizedException('SupabaseConnection이 주입되지 않았습니다.');
    } else {
      this.logger.log('SupabaseConnection이 성공적으로 주입되었습니다.');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      this.logger.log('Public endpoint입니다. 인증을 건너뜁니다.');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.error('토큰이 요청 헤더에 없습니다.');
      throw new UnauthorizedException('로그인하지 않은 사용자입니다.');
    }

    this.logger.log(`토큰 추출 성공: ${token}`);

    try {
      const { data, error } = await this.supabaseConnection.connection.auth.getUser(token);

      if (error) {
        this.logger.error(`Supabase 인증 오류: ${error.message}`);
        throw new UnauthorizedException('토큰이 유효하지 않습니다.');
      }

      this.logger.log(`유저 인증 성공: ${JSON.stringify(data.user)}`);
      request.user = data.user;
      return true;
    } catch (error) {
      this.logger.error(`canActivate 중 오류 발생: ${error.message}`);
      throw new UnauthorizedException('인증 과정에서 문제가 발생했습니다.');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      this.logger.error('Authorization 헤더가 없습니다.');
      return undefined;
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      this.logger.error(`Authorization 헤더 형식이 올바르지 않습니다. 헤더: ${authorizationHeader}`);
      return undefined;
    }

    this.logger.debug(`Authorization 헤더에서 추출된 토큰: ${token}`);
    return token;
  }
}
