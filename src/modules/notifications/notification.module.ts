import { Module } from '@nestjs/common';
import { AuthModule } from '../shared/auth/auth.module';
import { NotificationRepository } from './domain/repositories/notification.repository';
import { SQLiteNotificationRepository } from './infrastructure/repositories/notification.sqlite.repository';
import { NotificationCommentCreatedEventHandler } from './application/event-handlers/comment-created.event-handler';
import { NotificationPostAcceptedEventHandler } from './application/event-handlers/post-accepted.event-handler';
import { NotificationPostDeletedEventHandler } from './application/event-handlers/post-deleted.event-handler';
import { NotificationPostRejectedEventHandler } from './application/event-handlers/post-rejected.event-handler';
import { UserModule } from '../users/user.module';
import { NotificationPostWaitingEventHandler } from './application/event-handlers/post-waiting.event-handler';
import { PostCreatedEventHandler } from './application/event-handlers/post-created.event-handler';
import { FollowModule } from '../follows/follow.module';
import { NotificationController } from './infrastructure/controllers/notification.controller';
import { GetNotificationUseCase } from './application/use-cases/get-notification.use-case';
import { ReadSingleNotificationUseCase } from './application/use-cases/read-one-notification.use-case';
import { ReadAllNotificationsUseCase } from './application/use-cases/read-all-notification.use-case';

@Module({
  imports: [AuthModule, UserModule, FollowModule],
  controllers: [NotificationController],
  providers: [
    {
      provide: NotificationRepository,
      useClass: SQLiteNotificationRepository,
    },
    NotificationCommentCreatedEventHandler,
    NotificationPostRejectedEventHandler,
    NotificationPostAcceptedEventHandler,
    NotificationPostDeletedEventHandler,
    NotificationPostWaitingEventHandler,
    PostCreatedEventHandler,
    GetNotificationUseCase,
    ReadSingleNotificationUseCase,
    ReadAllNotificationsUseCase,
  ],
})
export class NotificationModule {}