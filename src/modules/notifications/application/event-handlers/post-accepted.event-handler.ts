import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { PostAcceptedEvent, type PostAcceptedEventPayload } from 'src/modules/posts/domain/events/post-accepted.event';

@Injectable()
export class NotificationPostAcceptedEventHandler {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  @OnEvent(PostAcceptedEvent)
  public handle(payload: PostAcceptedEventPayload) {
    const notification = NotificationEntity.create(
      'POST_ACCEPTED',
      'Your post was accepted',
      `A moderator accepted your post "${payload.postTitle}"`,
      `/posts/${payload.postId}`,
      payload.userId,
    );
    this.notificationRepository.createNotification(notification);
  }
}