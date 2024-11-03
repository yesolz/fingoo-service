import { PostDomain } from '../../../../domain/post.domain';

export class UpdatePostPort {
  updatePost(postId, content, userId): Promise<PostDomain>;
}
