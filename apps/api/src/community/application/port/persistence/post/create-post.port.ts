import { PostDomain } from '../../../../domain/post.domain';

export interface CreatePostPort {
  createPost(content: string, userId: string): Promise<PostDomain>;
}
