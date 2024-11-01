import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { SupabaseConnection } from '../infrastructure/adapter/supabase/supabase.connection';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private reflector: Reflector = new Reflector();

  constructor(
    @Inject(SupabaseConnection)
    private supabaseConnection: SupabaseConnection,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('[ERROR] 로그인하지 않은 사용자');
    }
    const { data, error } = await this.supabaseConnection.connection.auth.getUser(token);
    if (error) {
      throw new UnauthorizedException('[ERROR] 유효하지 않은 토큰', error.message);
    }

    request.user = data.user;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
