import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/modules/users/domain/entities/user.entity";
import { NotificationRepository } from "../../domain/repositories/notification.repository";
import { ReadAllNotificationDto } from "../dtos/read-all-notification.dto";

@Injectable()
export class ReadAllNotificationsUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(user: UserEntity): Promise<ReadAllNotificationDto> {
    const notifications = await this.notificationRepository.getAllNotifications(
      user.id,
    );
    let count = 0;
    for (const notification of notifications) {
      if (!notification.isRead) {
        notification.update(true);
        await this.notificationRepository.updateNotification(
          notification.id,
          notification,
        );
        count++;
      }
    }
    let res = new ReadAllNotificationDto()
    res.markedCount = count;
    return res;
  }
}