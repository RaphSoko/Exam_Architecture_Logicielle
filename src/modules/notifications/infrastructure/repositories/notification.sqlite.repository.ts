import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class SQLiteNotificationRepository implements NotificationRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async createNotification(input: NotificationEntity) {
    await this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .save(input.toJSON());
  }

  public async createNotifications(input: NotificationEntity[]) {
    await this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .save(input.map((a) => a.toJSON()));
  }

  public async getNotifications(
    idUser: string,
    page: number,
    pageSize: number,
    isRead: 'true' | 'false' | 'all',
  ): Promise<NotificationEntity[]> {
    const query = this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .createQueryBuilder('notification')
      .where('notification.userId = :idUser', { idUser });

    if (isRead === 'true') {
      query.andWhere('notification.isRead = true');
    } else if (isRead === 'false') {
      query.andWhere('notification.isRead = false');
    }

    query.skip((page - 1) * pageSize).take(pageSize);

    const data = await query.getMany();
    return data.map((comment) =>
      NotificationEntity.reconstitute({ ...comment }),
    );
  }

  public async getAllNotifications(
    idUser: string,

  ): Promise<NotificationEntity[]> {
    const query = this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .createQueryBuilder('notification')
      .where('notification.userId = :idUser', { idUser });

    const data = await query.getMany();
    return data.map((comment) =>
      NotificationEntity.reconstitute({ ...comment }),
    );
  }

  public async updateNotification(
    id: string,
    input: NotificationEntity,
  ): Promise<void> {
    await this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .update(id, input.toJSON());
  }

  public async getNotificationById(id: string): Promise<NotificationEntity | undefined> {
    const tag = await this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .findOne({ where: { id } });

    return tag ? NotificationEntity.reconstitute({ ...tag }) : undefined;
  }
}