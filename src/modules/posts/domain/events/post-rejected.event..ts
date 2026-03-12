export const PostRejectedEvent = 'post.rejected';

export type PostRejectedEventPayload = {
  postTitle: string,
  userId: string,
  postId: string
};