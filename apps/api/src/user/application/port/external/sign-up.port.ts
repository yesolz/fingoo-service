import { SessionDto } from '../../../api/dto/response/session.dto';

export interface SignUpPort {
  signUp(email: string, password: string): Promise<{ sessionDto: SessionDto; userId: string }>;
}
