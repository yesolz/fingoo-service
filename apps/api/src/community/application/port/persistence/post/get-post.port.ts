import { PostDomain } from '../../../../domain/post.domain';

export interface GetPostPort {
  getPost(postId): Promise<PostDomain>;
}
