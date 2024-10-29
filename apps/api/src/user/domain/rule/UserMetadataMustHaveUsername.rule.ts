import { BusinessRule } from 'src/commons/domain/business.rule';

export class UserMetadataMustHaveUsernameRule implements BusinessRule {
  constructor(private readonly username: string) {}

  isBroken = () => this.username === undefined || this.username === '' || this.username === null;

  get Message() {
    return '사용자 이름은 반드시 존재해야합니다.';
  }
}
