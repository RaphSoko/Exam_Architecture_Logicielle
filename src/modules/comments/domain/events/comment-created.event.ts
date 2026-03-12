export const CommentCreatedEvent = 'comment.created';

export type CommentCreatedEventPayload = {
  postTitle: string,
  commentAuthor: string,
  postId: string,
  userId: string,
};