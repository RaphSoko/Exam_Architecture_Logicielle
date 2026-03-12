import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { PostDeletedEvent, type PostDeletedEventPayload } from 'src/modules/posts/domain/events/post-deleted.event';
import { NotificationRepository } from '../../domain/repositories/notification.repository';

@Injectable()
export class NotificationPostDeletedEventHandler {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  @OnEvent(PostDeletedEvent)
  public handle(payload: PostDeletedEventPayload) {
    const notification = NotificationEntity.create(
      'POST_DELETED',
      'Your post was deleted',
      `A moderator rejected your post "${payload.postTitle}"`,
      `/posts`,
      payload.userId,
    );
    this.notificationRepository.createNotification(notification);
  }
}