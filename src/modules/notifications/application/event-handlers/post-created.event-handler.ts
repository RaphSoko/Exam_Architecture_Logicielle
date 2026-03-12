import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { PostCreatedEvent, type PostCreatedEventPayload} from 'src/modules/posts/domain/events/post-created.event';
import { UserRepository } from 'src/modules/users/domain/repositories/user.repository';
import { FollowRepository } from 'src/modules/follows/domain/repositories/follows.repository';
import { NotificationRepository } from '../../domain/repositories/notification.repository';

@Injectable()
export class PostCreatedEventHandler {
  constructor(
    private readonly notificationService: NotificationRepository,
    private readonly followService: FollowRepository,
    private readonly userService: UserRepository,
  ) {}

  @OnEvent(PostCreatedEvent)
  public async handle(payload: PostCreatedEventPayload) {
    const user = await this.userService.getUserById(payload.authorId);
    const targets = await this.followService.getUserFollowers(payload.authorId)
    if (!targets) return;
    for (const target of targets) {
      const notification = NotificationEntity.create(
        'NEW_POST_FROM_FOLLOWED',
        `${user?.getUsername} published a new post`,
        `${user?.getUsername} published a new post named "${payload.postTitle}"`,
        `/posts/${payload.postId}`,
        target.followerId,
      );

      await this.notificationService.createNotification(notification);
    }
  }
}