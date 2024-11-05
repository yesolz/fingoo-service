import { PostDomain } from '../../../../domain/post.domain';

export interface UpdatePostPort {
  updatePost(postId, content, userId): Promise<PostDomain>;
}
