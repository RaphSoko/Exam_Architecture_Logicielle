import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { NotificationEntity } from "../../domain/entities/notification.entity";
import { UserRepository } from "src/modules/users/domain/repositories/user.repository";
import { PostWaitingEvent, type PostWaitingEventPayload } from "src/modules/posts/domain/events/post-waiting.event";
import { NotificationRepository } from "../../domain/repositories/notification.repository";

@Injectable()
export class NotificationPostWaitingEventHandler {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository,
  ) {}

  @OnEvent(PostWaitingEvent)
  public async handle(payload: PostWaitingEventPayload) {
    const targets = await this.userRepository.getModsAndAdmins();
    for (const target of targets) {
      const notification = NotificationEntity.create(
        'POST_PENDING_REVIEW',
        'A post is waiting for a review',
        `The post "${payload.postTitle}" is waiting for a review`,
        `/posts/${payload.postId}`,
        target.id,
      );

      await this.notificationRepository.createNotification(notification);
    }
  }
}