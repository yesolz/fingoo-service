import { AggregateRoot } from 'src/commons/domain/aggregate-root';
import { PostContentLengthShouldNotExceedLimitRule } from './rule/PostContentLengthShouldNotExceedLimit.rule';
import { UserMetadataDomain } from '../../user/domain/user-metadata.domain';

export class PostDomain extends AggregateRoot {
  id: number;
  userMetadataDomain: UserMetadataDomain;
  content: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    userMetadataDomain: UserMetadataDomain,
    content: string,
    viewCount: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.checkRule(new PostContentLengthShouldNotExceedLimitRule(content));
    this.id = id;
    this.userMetadataDomain = userMetadataDomain;
    this.content = content;
    this.viewCount = viewCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    id: number,
    userMetadataDomain: UserMetadataDomain,
    content: string,
    viewCount: number,
    createdAt: Date,
    updatedAt: Date,
  ): PostDomain {
    return new PostDomain(id, userMetadataDomain, content, viewCount, createdAt, updatedAt);
  }

  updateContent(newContent: string) {
    this.checkRule(new PostContentLengthShouldNotExceedLimitRule(newContent));
    this.content = newContent;
  }
}
