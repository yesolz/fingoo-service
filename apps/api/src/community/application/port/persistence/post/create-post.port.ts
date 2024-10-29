import { PostEntity } from '../../../../infrastructure/adapter/persistence/entity/post.entity';

export interface CreatePostPort {
  createPost(postEntity: PostEntity): Promise<PostEntity>;
}
