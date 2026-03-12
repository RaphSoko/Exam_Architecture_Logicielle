import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('notifications')
export class SQLiteNotificationEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  type: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column()
  link: string;

  @Column()
  isRead: boolean;

  @Column()
  createdAt: Date;

}