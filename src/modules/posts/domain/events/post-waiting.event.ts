export const PostWaitingEvent = 'post.waiting';

export type PostWaitingEventPayload = {
  postTitle: string,
  userId: string,
  postId: string
};