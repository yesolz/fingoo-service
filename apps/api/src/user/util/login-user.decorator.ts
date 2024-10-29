import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const LoginUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (!request.user) {
    throw new UnauthorizedException('[ERROR] 로그인하지 않은 사용자');
  }
  // AuthGuard에서 user 데이터를 추가함
  return request.user;
});
