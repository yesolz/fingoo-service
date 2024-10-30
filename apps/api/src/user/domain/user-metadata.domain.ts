import { AggregateRoot } from 'src/commons/domain/aggregate-root';
import { UserMetadataMustHaveUsernameRule } from './rule/UserMetadataMustHaveUsername.rule';

export class UserMetadataDomain extends AggregateRoot {
  id: string;
  userId: string;
  email: string;
  username: string;

  constructor(id: string, userId: string, email: string, username: string) {
    super();
    this.checkRule(new UserMetadataMustHaveUsernameRule(username));
    this.id = id;
    this.userId = userId;
    this.email = email;
    this.username = username;
  }

  static create(id, userId, email, username): UserMetadataDomain {
    return new UserMetadataDomain(id, userId, email, username);
  }
}
