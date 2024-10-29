import { PostEntity } from '../../../../infrastructure/adapter/persistence/entity/post.entity';

export class DeletePostPort {
  deletePost(postEntity: PostEntity): Promise<PostEntity>;
}
