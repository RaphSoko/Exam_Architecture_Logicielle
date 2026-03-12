export const PostDeletedEvent = 'post.deleted';
export type PostDeletedEventPayload = {
  postId: string;
  postTitle: string;
  userId: string;
};
