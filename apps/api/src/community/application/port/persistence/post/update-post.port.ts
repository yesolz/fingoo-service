import { PostEntity } from '../../../../infrastructure/adapter/persistence/entity/post.entity';

export class UpdatePostPort {
  updatePost(postEntity: PostEntity): Promise<PostEntity>;
}
