import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { mockSession1, mockUser1 } from './mock-user.user1';

@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any): Observable<boolean> {
    request.user = mockUser1;
    request.headers.authorization = mockSession1;
    return of(true);
  }
}
