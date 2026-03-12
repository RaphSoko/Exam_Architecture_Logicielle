import { Injectable } from "@nestjs/common";
import { NotificationRepository } from "../../domain/repositories/notification.repository";
import { GetNotificationDto } from "../dtos/get-notification.dto";

@Injectable()
export class GetNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(
    idUser: string,
    page: number,
    pageSize: number,
    isRead: string,
  ): Promise<GetNotificationDto> {


    const allowedIsRead = ['false', 'true', 'all']

    const finalAllowedIsRead = (allowedIsRead.includes(isRead) ? isRead : allowedIsRead[2]) as 'false' | 'true' | 'all'

    const notifications = await this.notificationRepository.getNotifications(idUser, page, pageSize, finalAllowedIsRead);

    let res = new GetNotificationDto()
    res.notifications = notifications
    res.total = notifications.length
    res.page = page;
    res.pageSize = pageSize;
    res.unreadCount = notifications.filter((notif) => notif.isRead === false).length
    return res
  }
}