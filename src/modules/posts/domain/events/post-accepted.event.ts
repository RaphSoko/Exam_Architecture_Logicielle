export const PostAcceptedEvent = 'post.accepted';

export type PostAcceptedEventPayload = {
  postTitle: string,
  userId: string,
  postId: string
};