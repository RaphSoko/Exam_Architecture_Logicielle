import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { UserEntity } from "src/modules/users/domain/entities/user.entity";
import { NotificationEntity } from "../../domain/entities/notification.entity";
import { NotificationRepository } from "../../domain/repositories/notification.repository";

@Injectable()
export class ReadSingleNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(
    user: UserEntity,
    idNotification: string
  ): Promise<NotificationEntity> {


    const notification = await this.notificationRepository.getNotificationById(idNotification);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (!user.permissions.notification.canRead(notification.userId)) {
      throw new ForbiddenException('You do not have permission to read this notification');
    }
    notification.update(true);
    await this.notificationRepository.updateNotification(notification.id, notification)

    return notification
  }
}