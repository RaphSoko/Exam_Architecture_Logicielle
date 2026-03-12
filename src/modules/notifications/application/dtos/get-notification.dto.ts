import { NotificationEntity } from "../../domain/entities/notification.entity";

export class GetNotificationDto {
  notifications: NotificationEntity[];
  total: number;
  unreadCount: number;
  page: number;
  pageSize: number;
}