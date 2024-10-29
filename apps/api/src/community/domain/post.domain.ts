import { AggregateRoot } from 'src/utils/domain/aggregate-root';
import { PostContentLengthShouldNotExceedLimitRule } from './rule/PostContentLengthShouldNotExceedLimit.rule';
import { UserEntity } from '../../auth/infrastructure/adapter/persistence/entity/user.entity';

export class Post extends AggregateRoot {
  id: number;
  user: UserEntity;
  content: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: number, user: UserEntity, content: string, viewCount: number, createdAt: Date, updatedAt: Date) {
    super();
    this.id = id;
    this.user = user;
    this.content = content;
    this.viewCount = viewCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.checkRule(new PostContentLengthShouldNotExceedLimitRule(this.content));
  }

  static create(
    id: number = null,
    user: UserEntity,
    content: string,
    viewCount: number = 0,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ): Post {
    return new Post(id, user, content, viewCount, createdAt, updatedAt);
  }

  updateContent(newContent: string) {
    this.content = newContent;
    this.updatedAt = new Date();
    this.checkRule(new PostContentLengthShouldNotExceedLimitRule(this.content));
  }
}
