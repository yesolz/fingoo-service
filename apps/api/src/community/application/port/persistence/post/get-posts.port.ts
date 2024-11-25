import { PostDomain } from '../../../../domain/post.domain';

export interface GetPostsPort {
  getPostPageByCursor(
    take: number,
    cursor: number,
  ): Promise<{ postDomains: PostDomain[]; total: number; hasNextData: boolean; nextCursor: number }>;
}
