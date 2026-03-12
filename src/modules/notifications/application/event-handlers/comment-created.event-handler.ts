import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { CommentCreatedEvent, type CommentCreatedEventPayload } from 'src/modules/comments/domain/events/comment-created.event';

@Injectable()
export class NotificationCommentCreatedEventHandler {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  @OnEvent(CommentCreatedEvent)
  public handle(payload: CommentCreatedEventPayload) {
    const notification = NotificationEntity.create(
      'NEW_COMMENT',
      'New comment',
      `${payload.commentAuthor} posted a comment on your post "${payload.postTitle}"`,
      `/posts/${payload.postId}/comments`,
      payload.userId,
    );
    this.notificationRepository.createNotification(notification);
  }
}