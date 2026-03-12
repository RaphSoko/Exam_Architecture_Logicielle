export abstract class NotificationRepository {
  public abstract createNotification(input: NotificationEntity);
  public abstract createNotifications(input: NotificationEntity[]);
  public abstract getNotifications(
    idUser: string,
    page: number,
    pageSize: number,
    isRead: 'true' | 'false' | 'all',
  ): Promise<NotificationEntity[]>;

  public abstract getNotificationById(
    id: string,
  ): Promise<NotificationEntity | undefined>;
  public abstract getAllNotifications(
    idUser: string,
  ): Promise<NotificationEntity[]>;

  public abstract updateNotification(
    id: string,
    input: NotificationEntity,
  ): Promise<void>
}