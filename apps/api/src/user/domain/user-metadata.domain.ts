import { AggregateRoot } from 'src/commons/domain/aggregate-root';
import { PostEntity } from '../../community/infrastructure/adapter/persistence/entity/post.entity';
import { UserMetadataMustHaveUsernameRule } from './rule/UserMetadataMustHaveUsername.rule';

export class UserMetadataDomain extends AggregateRoot {
  id: string;
  userId: string;
  email: string;
  username: string;
  posts: PostEntity[];

  constructor(id: string, userId: string, email: string, username: string, posts: PostEntity[]) {
    super();
    this.checkRule(new UserMetadataMustHaveUsernameRule(username));
    this.id = id;
    this.userId = userId;
    this.email = email;
    this.username = username;
    this.posts = posts;
  }

  static create(id, userId, email, username, posts): UserMetadataDomain {
    return new UserMetadataDomain(id, userId, email, username, posts);
  }
}
