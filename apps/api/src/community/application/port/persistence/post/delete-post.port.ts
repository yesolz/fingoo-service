export interface DeletePostPort {
  deletePost(postId, userId): Promise<boolean>;
}
