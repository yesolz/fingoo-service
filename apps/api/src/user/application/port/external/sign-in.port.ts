import { SessionDto } from '../../../api/dto/response/session.dto';

export interface SignInPort {
  signIn(email: string, password: string): Promise<SessionDto>;
}
