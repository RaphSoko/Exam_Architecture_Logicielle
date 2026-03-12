import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { PostRejectedEvent, type PostRejectedEventPayload } from "src/modules/posts/domain/events/post-rejected.event.";
import { NotificationEntity } from "../../domain/entities/notification.entity";
import { NotificationRepository } from "../../domain/repositories/notification.repository";

@Injectable()
export class NotificationPostRejectedEventHandler {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  @OnEvent(PostRejectedEvent)
  public handle(payload: PostRejectedEventPayload) {
    const notification = NotificationEntity.create(
      'POST_REJECTED',
      'Your post was rejected',
      `A moderator rejected your post "${payload.postTitle}"`,
      `/posts/${payload.postId}`,
      payload.userId,
    );
    this.notificationRepository.createNotification(notification);
  }
}